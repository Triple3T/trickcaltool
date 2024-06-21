import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import Error404 from "@/components/errors/404";
import NeedUpdate from "./errors/need-update";
import UnknownError from "./errors/unknown-error";
interface ErrorObjectProps {
  name: string;
  message: string;
  stack: string;
}
interface RouteErrorProps {
  data: string;
  error: {
    columnNumber: number;
    fileName: string;
    lineNumber: number;
    message: string;
    stack: string;
  };
  internal: boolean;
  status: number;
  statusText: string;
}
type ErrorType = ErrorObjectProps | RouteErrorProps;
const ErrorElement = () => {
  const error = useRouteError() as ErrorType;
  useEffect(() => {
    console.log("Error", error);
    //
  }, [error]);
  // error as RouteErrorProps
  if ((error as RouteErrorProps).data) {
    if ((error as RouteErrorProps).status === 404) {
      return <Error404 message={(error as RouteErrorProps).error.message} />;
    }
    return (
      <UnknownError
        message={(error as RouteErrorProps).error.message}
        stack={(error as RouteErrorProps).error.stack}
      />
    );
  }

  // error as ErrorObjectProps
  if (
    (error as ErrorObjectProps).message
      .toLowerCase()
      .includes("dynamically imported module")
  ) {
    return (
      <NeedUpdate
        message={(error as ErrorObjectProps).message}
        stack={(error as ErrorObjectProps).stack}
      />
    );
  }
  return (
    <UnknownError
      message={(error as ErrorObjectProps).message}
      stack={(error as ErrorObjectProps).stack}
    />
  );
};

export default ErrorElement;
