import { Form, Select, Spin, Input, DatePicker } from 'antd';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

const InnerContent = styled.div`
  display: flex;
  flex: 1;
  overflow-y: scroll;
  padding: 24px;
  background: #fff;
`;

const FormWrapper = styled.div`
  max-width: 240px;

  /* @media screen and (min-width: 640px) {
    min-width: 150px;
  } */
`;

const Notes = () => {
  const [form] = Form.useForm();

  const handleChange = e => {};
  const handleDateChange = e => {};

  return (
    <InnerContent>
      <FormWrapper>
        <Form form={form}>
          <FirebaseDatabaseNode path='/strain'>
            {d =>
              d.value ? (
                <Form.Item name='strain' rules={[{ required: true }]}>
                  <Select placeholder='Strain' onChange={handleChange}>
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
          <Input.Group compact>
            <Input style={{ width: '50%' }} addonAfter='lb' />
            <Input style={{ width: '50%' }} addonAfter='oz' />
          </Input.Group>
          <DatePicker onChange={handleDateChange} />
          <TextArea rows={4} />
        </Form>
      </FormWrapper>
    </InnerContent>
  );
};

export default Notes;
