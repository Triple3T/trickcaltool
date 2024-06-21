import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import Error404 from "@/components/errors/404";
import NeedUpdate from "./errors/need-update";
import UnknownError from "./errors/unknown-error";
interface ErrorObjectProps {
  status: number;
  error: { message: string; stack: string };
}
const ErrorElement = () => {
  const error = useRouteError() as ErrorObjectProps;
  useEffect(() => {
    console.log(error);
  }, [error]);
  if (error.status === 404) {
    return <Error404 message={error.error.message} />;
  }
  if (
    error.error.message
      .toLowerCase()
      .includes("failed to fetch dynamically imported module")
  ) {
    return (
      <NeedUpdate message={error.error.message} stack={error.error.stack} />
    );
  }
  return (
    <UnknownError message={error.error.message} stack={error.error.stack} />
  );
};

export default ErrorElement;
