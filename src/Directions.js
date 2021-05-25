import { useState } from 'react';
import { Layout, Select, Button, Spin, Form } from 'antd';
import merge from 'lodash.merge';
import styled from 'styled-components';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import SubcultureTooltip from './components/SubcultureTooltip';
import './App.css';
import { config } from './config';

const { Content } = Layout;
const { Option } = Select;

const StyledContent = styled(Content)`
  display: flex;
  flex-direction: 'column';
  padding: '0 48px';
`;

const InnerContent = styled.div`
  display: flex;
  flex: 1;
  overflow-y: scroll;
  padding: 24px;
  background: #fff;
`;

const FormWrapper = styled.div`
  max-width: 120px;

  @media screen and (min-width: 640px) {
    min-width: 150px;
  }
`;

const StyledOl = styled.ol`
  padding-inline-start: 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 640px) {
    flex-direction: row;
    min-width: 150px;
  }
`;

const Directions = ({ directionType }) => {
  const emptyState = { edible: {}, flower: {} };
  const [chosen, setChosen] = useState(emptyState);
  const [showIngredient, setShowIngredient] = useState(false);
  const [form] = Form.useForm();

  const handleChange = e => {
    // type-prop-key (edible-flavor-cherry)
    const arr = e.split('-');
    const type = arr[0];
    const propKey = {};
    propKey[arr[1]] = arr[2]; // flavor: 'cherry'
    const typePropKey = {};
    typePropKey[type] = propKey; // edible: { flavor: 'cherry' }
    const merged = merge(chosen, typePropKey); // edible: { flavor: 'cherry', ...}

    // spread to new object to trigger rerender
    setChosen({ ...merged });
    setShowIngredient(false);
  };

  const getMenu = (type, prop, list) =>
    Object.keys(list).map(key => (
      <Option key={key} value={`${type}-${prop}-${key}`}>
        {list[key]}
      </Option>
    ));

  const getSelects = type => {
    const props = config.app.ingredient[type];

    return props.map(prop => (
      <FirebaseDatabaseNode key={prop} path={`/${prop}`}>
        {d =>
          d.value ? (
            <Form.Item name={prop} rules={[{ required: true }]}>
              <Select placeholder={`${prop[0].toUpperCase()}${prop.slice(1)}`} onChange={handleChange}>
                {getMenu(type, prop, d.value)}
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
  };

  const handleReset = () => {
    form.resetFields();
    setShowIngredient(false);
    setChosen(emptyState);
  };

  const getingredientButton = ingredientType => {
    const disabled = Object.keys(chosen[ingredientType]).length < config.app.ingredient[ingredientType].length;
    const button = (
      <Button type='primary' disabled={disabled} onClick={() => setShowIngredient(true)}>
        Get ingredient
      </Button>
    );

    if (disabled) return <SubcultureTooltip title='Please make all selections'>{button}</SubcultureTooltip>;

    return button;
  };

  const getResetButton = ingredientType => {
    const disabled = Object.keys(chosen[ingredientType]).length === 0;

    return (
      <Button type='link' onClick={() => handleReset()} disabled={disabled}>
        reset
      </Button>
    );
  };

  const interpolateValues = (type, value) => {
    const chosenFlavor = chosen[type].flavor;
    if (!chosenFlavor) return value;

    return value.replace(/Flavoring/gi, `${chosenFlavor[0].toUpperCase()}${chosenFlavor.slice(1)} Flavoring`);
  };

  const getInnerContent = type => (
    <InnerContent>
      <FormWrapper>
        <h2>{`${type[0].toUpperCase()}${type.slice(1)}`}</h2>
        <Form form={form}>
          {getSelects(type)}
          <ButtonWrapper>
            {getingredientButton(type)}
            {getResetButton(type)}
          </ButtonWrapper>
        </Form>
      </FormWrapper>
      {showIngredient && (
        <>
          <div style={{ flex: 1, marginLeft: '32px' }}>
            <h2>Ingredients</h2>
            <FirebaseDatabaseNode
              path={`/ingredients/${type === 'edible' ? chosen.edible.edibleType : chosen.flower.flowerType}`}>
              {d =>
                d.value ? (
                  <StyledOl>
                    {d.value.map((ingredient, i) => (
                      <li key={i}>{interpolateValues(type, ingredient)}</li>
                    ))}
                  </StyledOl>
                ) : (
                  <Spin />
                )
              }
            </FirebaseDatabaseNode>
          </div>
          <div style={{ flex: 1, marginLeft: '32px' }}>
            <h2>Directions</h2>
            <FirebaseDatabaseNode
              path={`/directions/${type === 'edible' ? chosen.edible.edibleType : chosen.flower.flowerType}`}>
              {d =>
                d.value ? (
                  <StyledOl>
                    {d.value.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </StyledOl>
                ) : (
                  <Spin />
                )
              }
            </FirebaseDatabaseNode>
          </div>
        </>
      )}
    </InnerContent>
  );

  return <StyledContent>{getInnerContent(directionType)}</StyledContent>;
};

export default Directions;
