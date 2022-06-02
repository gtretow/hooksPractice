import "./App.css";
import axios from "axios";
import * as React from "react";

const Button = ({ ...props }) => {
  //Enquanto o useCallback mantem a referencia da função
  //O useMemo executa a função e mantem a referencia do retorno dela
  React.useEffect(() => {
    console.log("BUTTON foi re-renderizado");

    return () => {};
  }, []);

  React.useEffect(() => {
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
  const filtered = React.useMemo(() => filter(users, query), [users, query]);
  return filtered.map((user) => <div key={user.id}>{user.name}</div>);
};

//criando context
const CountContext = React.createContext();

function ContextDiv(props) {
  const [context, setContext] = React.useState("teste");
  const value = [context, setContext];
  return <CountContext.Provider value={value} {...props} />;
}

function useCustomHook() {
  const context = React.useContext(CountContext);

  if (!context) {
    throw new Error("useContext deve ser utilizado dentro de um Wrapper");
  }

  return context;
}

//gerando um wrapper pro context

function ContextButton() {
  const [context, setContext] = useCustomHook();
  return (
    <div>
      <button onClick={() => setContext("contexto atualizado")}>
        Atualizar context
      </button>
      <div>{context}</div>
    </div>
  );
}

function App({ initialCount = 0, click = 1 }) {
  const inputEl = React.useRef(null);
  const [users, setUsers] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [text, setText] = React.useState("teste de ref");
  const [state, dispatch] = React.useReducer(countDispatcher, {
    count: initialCount,
  });

  const getUsers = React.useCallback(async () => {
    const data = await axios.get("https://jsonplaceholder.typicode.com/users");
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

  React.useEffect(() => {
    console.log("APP foi re-renderizado");
    getUsers();
    return () => {};
  }, [getUsers]);

  React.useEffect(() => {
    console.log("TEXT  ACIONADO");

    return () => {};
  }, [text]);

  const increment = () => dispatch({ type: "INCREMENT", click });
  const decrement = () => dispatch({ type: "DECREMENT", click });
  const { count } = state;
  return (
    <div className="App">
      <ContextDiv>
        <header className="App-header">
          <p>Teste de hooks</p>
          <p>
            <button type="button" onClick={increment}>
              Aumentar
            </button>
            <Button type="button" onClick={React.useCallback(decrement, [])}>
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
          <ContextButton />
        </header>
      </ContextDiv>
    </div>
  );
}

export default App;
