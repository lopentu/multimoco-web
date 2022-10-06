import { useEffect, useMemo, useState } from "react";

class TestClass{
  constructor(){
    console.log("TestClass constructed");
  }
}

function TestCompo(props: { count: number }) {

  useEffect(() => {
    console.log("use effect");
  }, [])
  console.log("render");
  return (
    <div>{props.count}</div>
  )
}

function long_running(){
  console.log("f(): long running function");
  return true;
}

export default function Test() {
  const [counter, setCounter] = useState(0);
  console.log("Render test page");
  const tc = new TestClass();
  const long_value = useMemo(long_running, [counter]);
  function init() {
    setTimeout(() => setCounter(counter + 1), 1000);
  }

  useEffect(()=>init(), []);
  return (
    <TestCompo count={counter} />
  )
}