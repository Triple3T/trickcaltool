import solveDispatch, { DispatchProp } from "@/utils/solveDispatch";

addEventListener("message", (e: MessageEvent<DispatchProp>) => {
  const prop: DispatchProp = e.data as DispatchProp;
  postMessage(JSON.stringify(solveDispatch(prop, true)));
});
