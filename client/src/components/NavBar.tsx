import React, { ReactElement } from "react";
import { Box, Flex, Button, Link, Grid, GridItem } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface Props {}

export default function NavBar({}: Props): ReactElement {
  const [{ data, fetching }] = useMeQuery();
  let rightSection = null;
  // data is loading
  if (!data?.me) {
    rightSection = (
      <>
        <NextLink href="/register">
          <Link p={2}>Register</Link>
        </NextLink>
        <NextLink href="/login">
          <Button p={2}>Login</Button>
        </NextLink>
      </>
    );
    //user is logged in
  } else {
    rightSection = (
      <>
        <Button mr={3} color="white">{data.me.username}</Button>
        <Button variant="link" color="white">Logout</Button>
      </>
    );
  }

  return (
    <Grid templateColumns="repeat(3, 1fr)" bg="#0a1f5c">
      {/* LEFT SECTION */}
      <GridItem>
        <Flex w="100%" h="100%" p={2} align="center" justify="center" color="white">
          LOGO
        </Flex>
      </GridItem>

      {/* MIDDLE SECTION */}
      <GridItem >
        <Flex m="auto" p={2} align="center" justify="space-around" color="white">
          <NextLink href="/">
            <Link p={2}>Home</Link>
          </NextLink>
          <NextLink href="/">
            <Link p={2}>Other Link</Link>
          </NextLink>
          <NextLink href="/">
            <Link p={2}>Other Link</Link>
          </NextLink>
        </Flex>
      </GridItem>

      {/* RIGHT SECTION */}
      <GridItem>
        <Flex m={"auto"} p={2} align="center" justify="flex-end" color="white">
          {rightSection}
        </Flex>
      </GridItem>
    </Grid>
  );
}
