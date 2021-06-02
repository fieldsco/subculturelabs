import { Form, Select, Spin, Input, DatePicker, Button, Popconfirm, List, Avatar } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';
import firebase from 'firebase';

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
  const handleFinish = values => {
    console.log('finish', values);
  };
  const handleFinishFailed = e => console.error('Failed:', e);
  const handleArchive = () => {
    form.submit();
  };

  let notes = [];
  firebase
    .database()
    .ref('notes')
    .on('value', snap => {
      snap.forEach(child => {
        notes.push({
          date: child.val().date,
          strain: child.val().strain,
          lb: child.val().lb,
          oz: child.val().oz,
          note: child.val().note,
        });
      });
    });

  return (
    <Content>
      <FormWrapper>
        <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
          <Form.Item name='date' rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <FirebaseDatabaseNode path='/strain'>
            {d =>
              d.value ? (
                <Form.Item name='strain' rules={[{ required: true }]}>
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
              <Form.Item noStyle name='lb' rules={[{ required: true }]}>
                <Input style={{ width: '50%' }} addonAfter='lb' />
              </Form.Item>
              <Form.Item noStyle name='oz' rules={[{ required: true }]}>
                <Input style={{ width: '50%' }} addonAfter='oz' />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name='notes' rules={[{ required: true }]}>
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
                  {item.date} {item.strain} {item.lb}lb {item.oz}oz
                </strong>
              }
              description={item.note}
            />
          </List.Item>
        )}
      />
    </Content>
  );
};

export default Notes;
