import { Box } from '@chakra-ui/react'
import React, { ReactElement } from 'react'

interface Props {
  children: React.ReactNode;
  variant?: 'small' | 'medium' | 'large'
}

export default function Wrapper({children, variant='medium'}: Props): ReactElement {

  const maxW = variant === 'small' ? "550px" : (variant === 'medium' ? "800px" : "950px")
  return (
    <Box mt={8} mx="auto" maxW={maxW} w="100%">
      {children}
    </Box>
  )
}



