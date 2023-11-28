import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzDPthqWf00ZNM4px9m5bYlZV9ytGTp6Y",
  authDomain: "programacao-react-vite.firebaseapp.com",
  projectId: "programacao-react-vite",
  storageBucket: "programacao-react-vite.appspot.com",
  messagingSenderId: "369974560278",
  appId: "1:369974560278:web:ffda429967218466399737",
  measurementId: "G-WE1S7H21M3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Adicionar mensagem ao Firebase
    await addDoc(collection(db, 'user'), {
      nome,
      mensagem,
      timestamp: serverTimestamp(),
    });

    // Limpar os campos do formulário
    setNome('');
    setMensagem('');
  };

  const handleDelete = async (id) => {
    // Excluir mensagem do Firebase
    await deleteDoc(doc(db, 'user', id));
  };

  useEffect(() => {
    const fetchData = async () => {
      // Obter mensagens do Firebase
      const querySnapshot = await getDocs(collection(db, 'user'));
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMensagens(messages);
    };

    const q = query(collection(db, 'user'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMensagens(messages);
    });

    fetchData();
    return () => unsubscribe();
  }, []);

  return (
    <div className='tudo'>
      <header>
        <form className="Cadastro" onSubmit={handleFormSubmit}>
          <h1>Mande sua mensagem:</h1>
          <div className="perguntas">
            <input
              type="text"
              className="nome"
              placeholder="Digite seu nome...."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              className="mensagem"
              placeholder="Digite sua mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
            />
            <button className="postar">
              <strong>Postar</strong>
            </button>
          </div>
        </form>
      </header>
      <main>
        <div className="list">
          {mensagens.map((msg) => (
            <div className="mensagem" key={msg.id}>
              <h2 className="usuario">{msg.nome}</h2>
              <button className="delete" onClick={() => handleDelete(msg.id)}>Excluir</button>
              <p className="mensagem_usuario">{msg.mensagem}</p>
              <hr />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;