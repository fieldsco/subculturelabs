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

const Notes = () => {
  const [form] = Form.useForm();
  const [notes, setNotes] = useState([]);
  const [workingNote, setWorkingNote] = useState({});
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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

    if (isArchiving) {
      var newNoteRef = notesRef.push();
      newNoteRef.set(noteObj);
      message.success('Note archived');
    } else {
      notesRef.child(workingNote.key).set(noteObj);
      message.success('Note saved');
    }

    getNotes();
  };

  const handleFinishFailed = e => message.error('Failed: ', e);

  const handleArchive = () => {
    setIsArchiving(true);
    form.submit();
    form.resetFields();
    setIsArchiving(false);
    message.success('Note archived');
  };

  const getNotes = () => {
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
        setIsDataLoaded(true);
      });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    isDataLoaded && (
      <Content>
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
            <Form.Item name='yield'>
              <Input.Group compact>
                <Form.Item noStyle name='lb' initialValue={workingNote.lb} rules={[{ required: true }]}>
                  <Input style={{ width: '50%' }} addonAfter='lb' />
                </Form.Item>
                <Form.Item noStyle name='oz' initialValue={workingNote.oz} rules={[{ required: true }]}>
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
        <h1 style={{ marginTop: '50px' }}>Notes</h1>
        <List
          itemLayout='horizontal'
          dataSource={notes}
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
    )
  );
};

export default Notes;
