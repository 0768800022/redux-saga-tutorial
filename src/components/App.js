
function* testing() {
  while(true){
    yield 1; //tạm dừng và trả về 1
    yield 2;
    yield 3;
  }
}

function App() {
  const iterator = testing();

  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
  

  return (
    <div>
      Redux-saga with React
    </div>
  );
}

export default App;
