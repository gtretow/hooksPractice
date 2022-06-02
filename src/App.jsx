import {
  useState,
  useReducer,
  useRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import "./App.css";
import axios from "axios";

const Button = ({ ...props }) => {
  //Enquanto o useCallback mantem a referencia da função
  //O useMemo executa a função e mantem a referencia do retorno dela
  useEffect(() => {
    console.log("BUTTON foi re-renderizado");

    return () => {};
  }, []);

  useEffect(() => {
    console.log("BUTTON FUNÇÃO ONCLICK ACIONADA");
  }, [props.onClick]);

  return <button {...props}></button>;
};

const filter = (users, query) => {
  console.log("FILTER FOI CHAMADO");
  return users.filter((user) => user.name.toLowerCase().includes(query));
};

//usecallback(fn,[])
//useMemo(() => fn, [])
const UserList = ({ users, query }) => {
  //com o uso do useMemo, acabaos impedindo que o componente UserList seja renderizado toda vez que clicamos no botão de aumentar ou diminuir uma contagem, pois o valor esta memoizado

  //o useCallback não executa a função, já o useMemo, sim. Então ele pega o valor dessa função e memoiza.
  const filtered = useMemo(() => filter(users, query), [users, query]);
  return filtered.map((user) => <div key={user.id}>{user.name}</div>);
};

function App({ initialCount = 0, click = 1 }) {
  const inputEl = useRef(null);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [text, setText] = useState("teste de ref");
  const [state, dispatch] = useReducer(countDispatcher, {
    count: initialCount,
  });

  const getUsers = useCallback(async () => {
    const data = await axios.get("https://jsonplaceholder.typicode.com/users");
    console.log("data", data);
    setUsers(data.data);
  }, []);

  function countDispatcher(state, action) {
    switch (action.type) {
      case "INCREMENT":
        inputEl.current.focus();
        setText("FOCADO");
        return { count: state.count + action.click };

      case "DECREMENT":
        inputEl.current.blur();
        setText("Perdeu o foco");
        return { count: state.count - action.click };

      default:
        throw new Error("O type enviado não existe");
    }
  }

  useEffect(() => {
    console.log("APP foi re-renderizado");
    getUsers();
    return () => {};
  }, [getUsers]);

  useEffect(() => {
    console.log("TEXT  ACIONADO");

    return () => {};
  }, [text]);

  const increment = () => dispatch({ type: "INCREMENT", click });
  const decrement = () => dispatch({ type: "DECREMENT", click });

  const { count } = state;
  return (
    <div className="App">
      <header className="App-header">
        <p>Teste de hooks</p>
        <p>
          <button type="button" onClick={increment}>
            Aumentar
          </button>
          <Button type="button" onClick={useCallback(decrement, [])}>
            Diminuir
          </Button>
        </p>
        <p>count is: {count}</p>
        <input
          ref={inputEl}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input onChange={(e) => setQuery(e.target.value)} />
        <UserList users={users} query={query}></UserList>
      </header>
    </div>
  );
}

export default App;
