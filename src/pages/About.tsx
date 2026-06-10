import { useDataQuery } from "@/api/handler";

import { type UserDetailsResponse } from "@/lib/objects";

import { Form } from "@/components/pages/about/Form";

import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";

export default function About() {
  const { data, isLoading, isError } = useDataQuery<null, UserDetailsResponse>(
    "manager",
    ["userDetails"],
    "/user/details",
    false,
  );

  if (isLoading) {
    return <Loading content="user details" />;
  }

  if (isError || !data) {
    return <Error content="user details" />;
  }

  return <Form data={data} />;
}
