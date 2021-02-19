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

interface Props {}

export default function Register({}: Props): ReactElement {
  return (
    //STUB Formik https://chakra-ui.com/docs/form/form-control
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, actions) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
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
              // isLoading={isSubmitting} //FIXME this produces error
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
