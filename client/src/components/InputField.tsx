import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes, ReactElement } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder?: string;
};

 const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input {...field} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
    </FormControl>
  );
}
export default InputField

// export default function InputField(props: InputFieldProps): ReactElement {
//   const [field, { error }] = useField(props);
//   return (
//     <FormControl isInvalid={!!error}>
//       <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
//       <Input {...field} id={field.name} placeholder={props.placeholder} />
//       {error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
//     </FormControl>
//   );
// }
