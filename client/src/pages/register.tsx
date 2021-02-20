import React, { ReactElement } from "react";
import { Formik, Form, Field } from "formik";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useMutation } from "urql";

interface Props {}

export default function Register({}: Props): ReactElement {
  //register mutation (useMutation hook comes from urql provider)
  const REGISTER_MUTATION = `
  mutation Register($username: String!, $password: String!) {
    register (options: {username:$username, password: $password}){
      errors{
        field
        message
      }
      user{
      id
        username
      createdAt
      updatedAt
      }
    }
  }
  `;

  const [, register] = useMutation(REGISTER_MUTATION); // useMutation hook comes from urql provider

  return (
    //STUB Formik https://chakra-ui.com/docs/form/form-control
    <Wrapper variant="large">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, actions) => {
          console.log(values);
          const response = await register(values);
        }}
      >
        {(props) => (
          <Form>
            {console.log(props)}
            <InputField
              name="username"
              label="Username"
              placeholder="username"
              type="text"
            />
            <InputField
              name="password"
              label="Password"
              placeholder="password"
              type="password"
            />
            <Button
              mt={4}
              colorScheme="teal"
              // isLoading={props.isSubmitting} //FIXME this produces error. Seems to be on chakra-ui side.
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
