'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Receipt, 
  Mail, 
  GraduationCap, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Search, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado dos Produtos
  const [produtos, setProdutos] = useState([
    { id: 'P001', nome: 'Notebook Pro 14', categoria: 'Informática', saldo: 12, custo: 3850, preco: 4690, min: 5 },
    { id: 'P002', nome: 'Monitor 24"', categoria: 'Informática', saldo: 18, custo: 780, preco: 999, min: 8 },
    { id: 'P003', nome: 'Teclado USB', categoria: 'Periféricos', saldo: 7, custo: 65, preco: 99, min: 10 },
    { id: 'P004', nome: 'Mouse USB', categoria: 'Periféricos', saldo: 42, custo: 42, preco: 69, min: 12 },
  ]);

  // Estado dos Clientes
  const [clientes, setClientes] = useState([
    { id: 1, nome: 'Cliente Exemplo Ltda', cnpj: '00.000.000/0001-99', contato: 'Ana Souza', email: 'compras@cliente.com', fone: '(65) 99999-0000', condicao: '28 dias' },
    { id: 2, nome: 'Tech Solutions SA', cnpj: '11.222.333/0001-88', contato: 'Carlos Lima', email: 'financeiro@techsolutions.com', fone: '(65) 98888-1111', condicao: 'À Vista' },
  ]);

  // Form de Novos Clientes
  const [novoCliente, setNovoCliente] = useState({ nome: '', cnpj: '', contato: '', email: '', fone: '', condicao: '28 dias' });

  // Movimentação de Estoque
  const [movProd, setMovProd] = useState('P001');
  const [movQtd, setMovQtd] = useState(1);
  const [movTipo, setMovTipo] = useState('ENTRADA');

  // Faturamento
  const [docTipo, setDocTipo] = useState('NF-e');
  const [clienteFat, setClienteFat] = useState('Cliente Exemplo Ltda');
  const [prodFat, setProdFat] = useState('P001');
  const [qtdFat, setQtdFat] = useState(1);
  const [faturaGerada, setFaturaGerada] = useState(null);

  // E-mail Corporativo
  const [emailPara, setEmailPara] = useState('fornecedor@empresa.com');
  const [emailAssunto, setEmailAssunto] = useState('Confirmação de Pedido • PO-2026-014');
  const [emailCorpo, setEmailCorpo] = useState('Bom dia, Ana.\n\nConfirmamos o recebimento da proposta e solicitamos a confirmação do prazo de entrega do pedido PO-2026-014.\n\nAtenciosamente,\nLuan • Compras • FragaTech');

  // Handlers
  const handleAddCliente = (e) => {
    e.preventDefault();
    if (!novoCliente.nome) return;
    setClientes([...clientes, { ...novoCliente, id: Date.now() }]);
    setNovoCliente({ nome: '', cnpj: '', contato: '', email: '', fone: '', condicao: '28 dias' });
  };

  const handleMovEstoque = (e) => {
    e.preventDefault();
    setProdutos(produtos.map(p => {
      if (p.id === movProd) {
        const delta = movTipo === 'ENTRADA' ? Number(movQtd) : -Number(movQtd);
        return { ...p, saldo: Math.max(0, p.saldo + delta) };
      }
      return p;
    }));
  };

  const handleGerarFatura = (e) => {
    e.preventDefault();
    const prod = produtos.find(p => p.id === prodFat);
    const total = prod ? prod.preco * qtdFat : 0;
    const chave = Array.from({length: 44}, () => Math.floor(Math.random() * 10)).join('');
    setFaturaGerada({
      tipo: docTipo,
      cliente: clienteFat,
      produto: prod ? prod.nome : '',
      qtd: qtdFat,
      total: total,
      chave: chave,
      data: new Date().toLocaleDateString('pt-PT')
    });
  };

  // Indicadores
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + (p.saldo * p.custo), 0);
  const itensComprar = produtos.filter(p => p.saldo <= p.min).length;

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg font-bold text-xl">FT</div>
            <div>
              <h1 className="font-bold text-lg leading-none">FragaTech</h1>
              <span className="text-xs text-slate-400">Laboratório SENAI</span>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'clientes', label: 'Clientes', icon: Users },
              { id: 'estoque', label: 'Estoque', icon: Package },
              { id: 'fiscal', label: 'Fiscal & Faturamento', icon: Receipt },
              { id: 'email', label: 'E-mail Corporativo', icon: Mail },
              { id: 'didatico', label: 'Modo Didático (SENAI)', icon: GraduationCap }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          SENAI • Gestão Operacional v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Visão Geral da Operação</h2>
                <p className="text-slate-500 text-sm">Acompanhe os principais indicadores da FragaTech Distribuidora.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor em Estoque</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">R$ {valorTotalEstoque.toLocaleString('pt-BR')}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={20}/></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clientes Cadastrados</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{clientes.length} Ativos</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={20}/></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atenção de Reposição</p>
                    <h3 className="text-2xl font-bold text-amber-600 mt-1">{itensComprar} Produto(s)</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={20}/></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faturamento Simulado</p>
                    <h3 className="text-2xl font-bold text-indigo-600 mt-1">R$ 128.300</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={20}/></div>
                </div>
              </div>
            </div>

            {/* Resumo de Estoque Crítico */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Status de Reposição de Estoque</h3>
              <div className="divide-y divide-slate-100">
                {produtos.map(p => {
                  const comprar = p.saldo <= p.min;
                  return (
                    <div key={p.id} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold text-slate-800">{p.nome}</span>
                        <span className="text-xs text-slate-400 ml-2">({p.id})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">Saldo: <b>{p.saldo}</b> (Mín: {p.min})</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${comprar ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {comprar ? 'COMPRAR' : 'OK'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Cadastro de Clientes</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddCliente} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Plus size={18} className="text-blue-600"/> Novo Cliente
                </h3>
                <input 
                  type="text" placeholder="Razão Social" required
                  value={novoCliente.nome} onChange={e => setNovoCliente({...novoCliente, nome: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm" 
                />
                <input 
                  type="text" placeholder="CNPJ / CPF" required
                  value={novoCliente.cnpj} onChange={e => setNovoCliente({...novoCliente, cnpj: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm" 
                />
                <input 
                  type="text" placeholder="Pessoa de Contato" required
                  value={novoCliente.contato} onChange={e => setNovoCliente({...novoCliente, contato: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm" 
                />
                <input 
                  type="email" placeholder="E-mail Financeiro" required
                  value={novoCliente.email} onChange={e => setNovoCliente({...novoCliente, email: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm" 
                />
                <input 
                  type="text" placeholder="Telefone"
                  value={novoCliente.fone} onChange={e => setNovoCliente({...novoCliente, fone: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm" 
                />
                <select 
                  value={novoCliente.condicao} onChange={e => setNovoCliente({...novoCliente, condicao: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm"
                >
                  <option>À Vista</option>
                  <option>14 dias</option>
                  <option>28 dias</option>
                  <option>30/60 dias</option>
                </select>
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30">
                  Salvar Cliente
                </button>
              </form>

              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Base de Clientes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-slate-500">
                        <th className="p-3">Razão Social</th>
                        <th className="p-3">CNPJ</th>
                        <th className="p-3">Contato</th>
                        <th className="p-3">E-mail</th>
                        <th className="p-3">Condição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {clientes.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">{c.nome}</td>
                          <td className="p-3 text-slate-500">{c.cnpj}</td>
                          <td className="p-3">{c.contato}</td>
                          <td className="p-3 text-slate-500">{c.email}</td>
                          <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{c.condicao}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ESTOQUE */}
        {activeTab === 'estoque' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Controle e Saldo de Estoque</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleMovEstoque} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900">Registrar Movimentação</h3>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Tipo de Movimento</label>
                  <div className="flex gap-2 mt-1">
                    <button 
                      type="button" onClick={() => setMovTipo('ENTRADA')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg ${movTipo === 'ENTRADA' ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}
                    >
                      + ENTRADA
                    </button>
                    <button 
                      type="button" onClick={() => setMovTipo('SAIDA')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg ${movTipo === 'SAIDA' ? 'bg-red-600 text-white' : 'bg-slate-100'}`}
                    >
                      - SAÍDA
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500">Produto</label>
                  <select 
                    value={movProd} onChange={e => setMovProd(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                  >
                    {produtos.map(p => <option key={p.id} value={p.id}>{p.id} - {p.nome}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500">Quantidade</label>
                  <input 
                    type="number" min="1" value={movQtd} onChange={e => setMovQtd(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800">
                  Confirmar Movimento
                </button>
              </form>

              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Planilha de Saldos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-slate-500">
                        <th className="p-3">Cód</th>
                        <th className="p-3">Produto</th>
                        <th className="p-3">Saldo</th>
                        <th className="p-3">Preço Unit.</th>
                        <th className="p-3">Mínimo</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {produtos.map(p => {
                        const status = p.saldo <= p.min ? 'COMPRAR' : 'OK';
                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-600">{p.id}</td>
                            <td className="p-3 font-semibold">{p.nome}</td>
                            <td className="p-3 font-bold">{p.saldo}</td>
                            <td className="p-3">R$ {p.preco.toLocaleString('pt-BR')}</td>
                            <td className="p-3 text-slate-500">{p.min}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${status === 'COMPRAR' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FISCAL */}
        {activeTab === 'fiscal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Emissor & Simulação Fiscal</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <form onSubmit={handleGerarFatura} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900">Simular Emissão de Documento</h3>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500">Tipo de Documento Fiscal</label>
                  <select 
                    value={docTipo} onChange={e => setDocTipo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                  >
                    <option value="NF-e">NF-e (Circulação de Mercadorias)</option>
                    <option value="NFS-e">NFS-e (Prestação de Serviços)</option>
                    <option value="CT-e">CT-e (Transporte de Cargas)</option>
                    <option value="MDF-e">MDF-e (Manifesto Eletrônico)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500">Destinatário / Cliente</label>
                  <select 
                    value={clienteFat} onChange={e => setClienteFat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                  >
                    {clientes.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Item/Produto</label>
                    <select 
                      value={prodFat} onChange={e => setProdFat(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                    >
                      {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Quantidade</label>
                    <input 
                      type="number" min="1" value={qtdFat} onChange={e => setQtdFat(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30">
                  Emitir Documento Simulado
                </button>
              </form>

              {/* Visualizador de Documento Simulado */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Resultado / Visualização DANFE</h3>
                {faturaGerada ? (
                  <div className="border border-slate-300 p-4 rounded-xl bg-slate-50 space-y-3 text-xs font-mono">
                    <div className="border-b pb-2 flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-800">EMISSÃO SIMULADA • {faturaGerada.tipo}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold">AUTORIZADO</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Chave de Acesso:</span>
                      <span className="break-all font-bold">{faturaGerada.chave}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-t border-b py-2">
                      <div><b>Emitente:</b> FragaTech Distribuidora</div>
                      <div><b>Destinatário:</b> {faturaGerada.cliente}</div>
                    </div>
                    <div>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b">
                            <th>Item</th><th>Qtd</th><th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{faturaGerada.produto}</td>
                            <td>{faturaGerada.qtd}</td>
                            <td className="font-bold">R$ {faturaGerada.total.toLocaleString('pt-BR')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2 bg-slate-200 rounded text-[10px] text-slate-600">
                      XML Estruturado gerado com sucesso para ambiente didático.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Receipt size={48} className="mx-auto mb-2 opacity-30"/>
                    <p>Preencha os dados ao lado para gerar uma NF-e/NFS-e/CT-e simulada.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EMAIL */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">E-mail Corporativo & Comunicação</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900">Novo E-mail de Processo</h3>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Para:</label>
                  <input 
                    type="email" value={emailPara} onChange={e => setEmailPara(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Assunto:</label>
                  <input 
                    type="text" value={emailAssunto} onChange={e => setEmailAssunto(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Mensagem:</label>
                  <textarea 
                    rows="6" value={emailCorpo} onChange={e => setEmailCorpo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm mt-1 font-mono"
                  ></textarea>
                </div>
                <button onClick={() => alert('E-mail corporativo enviado com sucesso!')} className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30">
                  Enviar Mensagem
                </button>
              </div>

              {/* Checklist de Segurança */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600"/> Checklist de Segurança
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5"/>
                    Assunto específico, claro e com referência do pedido.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5"/>
                    Destinatários e cópias revisados (CC e CCO).
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5"/>
                    Minimização de dados sensíveis e senhas.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5"/>
                    Verificação anti-phishing (remetente e anexos).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* MODO DIDÁTICO */}
        {activeTab === 'didatico' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Modo Didático — Laboratório SENAI</h2>

            <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-2">Desafio Prático Integrado</h3>
              <p className="text-blue-200 text-sm">
                Siga a sequência de atividades para praticar a visão sistémica:
                <br/>
                <b>Cliente → Pedido → Estoque → Faturamento → Transporte → Entrega</b>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded text-xs">PRÁTICA 1</span>
                <h4 className="font-bold text-slate-900">Recebimento e Estoque</h4>
                <p className="text-sm text-slate-600">Receba a mercadoria no sistema, atualize os saldos e verifique se algum item ficou abaixo do estoque mínimo.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 font-bold rounded text-xs">PRÁTICA 2</span>
                <h4 className="font-bold text-slate-900">Faturamento & Emissão</h4>
                <p className="text-sm text-slate-600">Com o pedido aprovado, realize a simulação de emissão de NF-e e verifique os dados fiscais e o arquivo XML.</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}