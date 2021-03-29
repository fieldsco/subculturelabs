import { useState } from 'react';
import { Layout, Select, Menu, Button, Spin, Form } from 'antd';
import SubcultureTooltip from './components/SubcultureTooltip';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import styled from 'styled-components';
import './App.css';
import { config } from './config';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const InnerContent = styled.div`
  flex: 1;
  display: flex;
  padding: 24px;
  background: #fff;
  margin-top: 32px;
`;

const FormWrapper = styled.div`
  min-width: 30px;

  @media screen and (min-width: 640px) {
    min-width: 150px;
  }
`;

const Application = () => {
  const [chosen, setChosen] = useState({});
  const [showRecipe, setShowRecipe] = useState(false);
  const [form] = Form.useForm();

  const handleChange = e => {
    const arr = e.split('-');
    const obj = Object.assign(chosen, {});
    obj[arr[0]] = arr[1];
    setChosen({ ...chosen, ...obj });
  };

  const getMenu = (prop, list) =>
    Object.keys(list).map(key => (
      <Option key={key} value={`${prop}-${key}`}>
        {list[key]}
      </Option>
    ));

  const getSelects = () =>
    config.app.recipeProps.map(prop => (
      <FirebaseDatabaseNode key={prop} path={`/${prop}`}>
        {d =>
          d.value ? (
            <Form.Item name={prop} rules={[{ required: true }]}>
              <Select placeholder={`${prop[0].toUpperCase()}${prop.slice(1)}`} onChange={handleChange}>
                {getMenu(prop, d.value)}
              </Select>
            </Form.Item>
          ) : (
            <div>
              <Spin />
            </div>
          )
        }
      </FirebaseDatabaseNode>
    ));

  const handleSubmit = () => {
    console.log(chosen);
    setShowRecipe(true);
  };

  const handleReset = () => {
    form.resetFields();
    setShowRecipe(false);
    setChosen({});
  };

  const getRecipeButton = () => {
    const disabled = Object.keys(chosen).length < 4;
    const button = (
      <Button type='primary' disabled={disabled} onClick={handleSubmit}>
        Get Recipe
      </Button>
    );

    if (disabled) {
      return <SubcultureTooltip title='Please make all selections'>{button}</SubcultureTooltip>;
    }

    return button;
  };

  return (
    <Layout className='layout' style={{ height: '100%' }}>
      <Header>
        <Menu theme='dark' mode='horizontal' selectedKeys={['1']}>
          <Menu.Item key='1'>Recipes</Menu.Item>
          <Menu.Item key='2'>Orders</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ display: 'flex', padding: '0 48px' }}>
        <InnerContent>
          <FormWrapper>
            <Form form={form}>
              {getSelects()}
              {getRecipeButton()}
              <Button type='link' onClick={handleReset}>
                reset
              </Button>
            </Form>
          </FormWrapper>
          {showRecipe && (
            <div style={{ flex: 1, marginLeft: '32px' }}>
              <FirebaseDatabaseNode path='/recipe'>
                {d => (d.value ? <div style={{ textAlign: 'justify' }}>{d.value}</div> : <Spin />)}
              </FirebaseDatabaseNode>
            </div>
          )}
        </InnerContent>
      </Content>
      <Footer>Subculture Labs ©2021</Footer>
    </Layout>
  );
};

export default Application;
