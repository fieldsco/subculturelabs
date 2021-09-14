import { useEffect, useState } from 'react';
import { Form, Select, Spin, Input, DatePicker, Button, Popconfirm, List, Avatar, message } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';
import firebase from 'firebase';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const Content = styled.div`
  padding: 24px;
  background: #fff;
`;

const FormWrapper = styled.div`
  max-width: 240px;

  @media screen and (min-width: 640px) {
    min-width: 150px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media screen and (min-width: 640px) {
    flex-direction: row;
    min-width: 150px;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  max-width: 450px;
`;

const Notes = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [workingNote, setWorkingNote] = useState({});
  const [isArchiving, setIsArchiving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleFinish = values => {
    const noteObj = {
      date: values.date.valueOf(),
      lb: values.lb,
      oz: values.oz,
      strain: values.strain,
      note: values.note,
      archived: isArchiving,
    };
    const notesRef = firebase.database().ref('notes');

    if (workingNote.key) {
      notesRef.child(workingNote.key).set(noteObj);
    } else {
      const newNoteRef = notesRef.push();
      newNoteRef.set(noteObj);
    }

    if (isArchiving) {
      form.setFieldsValue({
        date: moment(),
        lb: '',
        oz: '',
        strain: '',
        note: '',
      });
      setWorkingNote({});
      setIsArchiving(false);
    }

    message.success(isArchiving ? 'Note archived' : 'Note saved');
    getNotes();
  };

  const handleFinishFailed = e => console.error('Failed: ', e);

  const handleArchive = () => {
    setIsArchiving(true);
    form.submit();
  };

  const handleFinishSearch = values => {
    const filteredNotes = [];
    let matchedDate = false,
      matchedText = false;
    notes.map(note => {
      matchedDate = values.searchDate && values.searchDate.isSame(moment(note.date), 'day');
      matchedText = values.searchText && (values.searchText === note.strain || note.note.includes(values.searchText));

      // if date matched entered value, and search text is either blank or it matches
      if (matchedDate && (!values.searchText || matchedText)) filteredNotes.push(note);
      // if text matched entered value, and there is no date entered
      else if (matchedText && !values.searchDate) filteredNotes.push(note);
      // if nothing entered, that's considered "all"
      else if (!values.searchDate && !values.searchText) filteredNotes.push(note);
    });

    setFilteredNotes(filteredNotes);
  };

  const handleReset = () => {
    searchForm.setFieldsValue({
      searchDate: '',
      searchText: '',
    });
    setFilteredNotes(notes);
  };

  const getNotes = () => {
    setIsLoading(true);
    const notes = [];
    firebase
      .database()
      .ref('notes')
      .orderByChild('date')
      .on('value', snap => {
        snap.forEach(child => {
          const note = {
            key: child.key,
            date: child.val().date,
            strain: child.val().strain,
            lb: child.val().lb,
            oz: child.val().oz,
            note: child.val().note,
          };

          if (child.val().archived) {
            notes.push(note);
          } else {
            setWorkingNote(note);
          }
        });
        const reversed = notes.reverse();
        setNotes(reversed);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return !isLoading ? (
    <Content>
      <h1>Working Note</h1>
      <FormWrapper>
        <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
          <Form.Item name='date' initialValue={moment(workingNote.date)} rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <FirebaseDatabaseNode path='/strain'>
            {d =>
              d.value ? (
                <Form.Item name='strain' initialValue={workingNote.strain} rules={[{ required: true }]}>
                  <Select placeholder='Strain'>
                    {Object.keys(d.value).map(key => (
                      <Option key={key} value={key}>
                        {`${key[0].toUpperCase()}${key.slice(1)}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <div>
                  <Spin />
                </div>
              )
            }
          </FirebaseDatabaseNode>
          <Form.Item>
            <Input.Group compact>
              <Form.Item noStyle name='lb' initialValue={workingNote.lb}>
                <Input style={{ width: '50%' }} addonAfter='lb' />
              </Form.Item>
              <Form.Item noStyle name='oz' initialValue={workingNote.oz}>
                <Input style={{ width: '50%' }} addonAfter='oz' />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name='note' initialValue={workingNote.note} rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <ButtonWrapper>
            <Button type='primary' htmlType='submit' style={{ marginBottom: '4px' }}>
              Save
            </Button>
            <Popconfirm onConfirm={handleArchive} title='Are you sure?' okText='Yes' cancelText='No'>
              <Button type='primary'>Archive</Button>
            </Popconfirm>
          </ButtonWrapper>
        </Form>
      </FormWrapper>
      <h1 style={{ margin: '50px 0 0 0' }}>Archived Notes</h1>
      <SearchWrapper>
        <Form form={searchForm} onFinish={handleFinishSearch}>
          <Form.Item name='searchDate'>
            <DatePicker placeholder='Search by date' style={{ width: '150px' }} />
          </Form.Item>
          <Form.Item name='searchText'>
            <Input placeholder='Search by strain/note' style={{ width: '200px' }} allowClear />
          </Form.Item>
          <ButtonWrapper>
            <Button type='link' htmlType='submit'>
              search
            </Button>
            <Button type='link' onClick={handleReset}>
              reset
            </Button>
          </ButtonWrapper>
        </Form>
      </SearchWrapper>
      <List
        itemLayout='horizontal'
        dataSource={
          searchForm.getFieldValue('searchDate') || searchForm.getFieldValue('searchText') ? filteredNotes : notes
        }
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src='https://cdn.britannica.com/s:300x169,c:crop/63/103163-050-F26733EB/Snoop-Dogg.jpg' />
              }
              title={
                <strong>
                  {moment(item.date).format('MM-DD-YYYY')} {item.strain} {item.lb}lb {item.oz}oz
                </strong>
              }
              description={item.note}
            />
          </List.Item>
        )}
      />
    </Content>
  ) : null;
};

export default Notes;
