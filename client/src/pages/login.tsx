import React, { ReactElement } from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface Props {}

export default function Login({}: Props): ReactElement {
  const [, login] = useLoginMutation();

  const router = useRouter();
  return (
    //STUB Formik https://chakra-ui.com/docs/form/form-control
    <Wrapper variant="large">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, actions) => {
          const response = await login({options: values});
          console.log(
            "🚀 ~ file: login.tsx ~ line 53 ~ onSubmit={ ~ response",
            response
          );
          if (response.data?.login.errors) {
            actions.setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push("/");
          }
        }}
      >
        {(props) => (
          <Form>
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
