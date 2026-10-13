export type Aluno = {
  ra: string;
  nome: string;
  turma: string;
  curso: string;
  email: string;
  senha: string;
};

/** Lista de alunos extraída da planilha QUA.532.001 e QUA.162.002
 *  Login = RA | Senha = RA (padrão da planilha)
 *  Professor: professor / senai2026
 */
export const ALUNOS: Aluno[] = [
  // === QUA.532.001 — OPERADOR DE COMPUTADOR ===
  { ra: "660867", nome: "ALBERTO EDUARDO DE SOUZA SILVA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "660867@alunosenai.mt", senha: "660867" },
  { ra: "594339", nome: "EMILLY VITÓRIA VIEIRA DOS SANTOS", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "594339@alunosenai.mt", senha: "594339" },
  { ra: "617733", nome: "ESTEFFANY ALVES OLIVEIRA DE SOUZA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "617733@alunosenai.mt", senha: "617733" },
  { ra: "660797", nome: "EUCLIDES DUARTE SANTOS", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "660797@alunosenai.mt", senha: "660797" },
  { ra: "641786", nome: "GABRIELA OLIVEIRA DA SILVA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "641786@alunosenai.mt", senha: "641786" },
  { ra: "663829", nome: "HELLYN JULIA MINOTT BUENO", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "663829@alunosenai.mt", senha: "663829" },
  { ra: "664443", nome: "HELOISA BUENO DOS SANTOS", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "664443@alunosenai.mt", senha: "664443" },
  { ra: "660956", nome: "IGOR MONTEIRO DOS SANTOS", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "660956@alunosenai.mt", senha: "660956" },
  { ra: "664161", nome: "JOÃO ARTHUR ARANTES MORAES", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "664161@alunosenai.mt", senha: "664161" },
  { ra: "663786", nome: "JOÃO CARLOS DE SOUZA SALGUEIRO", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "663786@alunosenai.mt", senha: "663786" },
  { ra: "641868", nome: "KARINA JORDANA DA SILVA VIANA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "641868@alunosenai.mt", senha: "641868" },
  { ra: "617753", nome: "LINYKER EDUARDO RIOS CANDIA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "617753@alunosenai.mt", senha: "617753" },
  { ra: "664278", nome: "LUCAS ALMEIDA VIANA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "664278@alunosenai.mt", senha: "664278" },
  { ra: "661110", nome: "LUCAS SCHUWARTZ DE CAMPOS", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "661110@alunosenai.mt", senha: "661110" },
  { ra: "664502", nome: "LUIZ EDUARDO COELHO SANTOS", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "664502@alunosenai.mt", senha: "664502" },
  { ra: "664414", nome: "MATEUS SARMENTO SALGUEIRO", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "664414@alunosenai.mt", senha: "664414" },
  { ra: "664182", nome: "MAYCON DOUGLAS SANTANA MACHADO", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "664182@alunosenai.mt", senha: "664182" },
  { ra: "597628", nome: "RAU GABRIEL DOS SANTOS SILVA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "597628@alunosenai.mt", senha: "597628" },
  { ra: "661099", nome: "RAYSSA DA SILVA MOREIRA", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "661099@alunosenai.mt", senha: "661099" },
  { ra: "626996", nome: "SAMUEL ESTEFANUTTO TAQUES", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "626996@alunosenai.mt", senha: "626996" },
  { ra: "664637", nome: "WADYSON VICTOR SILVA MARQUES", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "664637@alunosenai.mt", senha: "664637" },
  { ra: "641935", nome: "WALLYSON VINICIUS SILVA MARQUES", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "641935@alunosenai.mt", senha: "641935" },
  { ra: "663707", nome: "WENDRICK FREITAS NASCIMENTO", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "663707@alunosenai.mt", senha: "663707" },
  { ra: "617564", nome: "WILLAN ADRIANO CUNHA PUTARÉ", turma: "QUA.532.001", curso: "OPERADOR DE COMPUTADOR", email: "617564@alunosenai.mt", senha: "617564" },

  // === QUA.162.002 — ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA ===
  // (Acesso/Senha não preenchidos na planilha → usamos RA / RA)
  { ra: "663663", nome: "ANA LAURA LIMA GONÇALVES", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663663@alunosenai.mt", senha: "663663" },
  { ra: "663281", nome: "ANTONIO GABRIEL PEREIRA DE SOUZA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663281@alunosenai.mt", senha: "663281" },
  { ra: "659606", nome: "BRUNO ELOI DE SOUSA SANTOS", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "659606@alunosenai.mt", senha: "659606" },
  { ra: "663274", nome: "CARLOS DANIEL LOIOLA DA SILVA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663274@alunosenai.mt", senha: "663274" },
  { ra: "663684", nome: "CAYQUE DUARTE DE SOUZA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663684@alunosenai.mt", senha: "663684" },
  { ra: "663660", nome: "DONIZETE GABRIEL ALEIXO DA SILVA FILHO", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663660@alunosenai.mt", senha: "663660" },
  { ra: "663275", nome: "ESTELA DE OLIVEIRA ANDRETTA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663275@alunosenai.mt", senha: "663275" },
  { ra: "663650", nome: "GABRIELLE SIQUEIRA DOS SANTOS", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663650@alunosenai.mt", senha: "663650" },
  { ra: "663292", nome: "GABRIELLY HORBACH SANTOS", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663292@alunosenai.mt", senha: "663292" },
  { ra: "663652", nome: "IAN VITOR ALVES DE LARA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663652@alunosenai.mt", senha: "663652" },
  { ra: "663278", nome: "IASMIM DE PAULA PEREIRA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663278@alunosenai.mt", senha: "663278" },
  { ra: "659669", nome: "KAUHANY NICOLLY DOS SANTOS TUSSOLINI", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "659669@alunosenai.mt", senha: "659669" },
  { ra: "663285", nome: "KEMYLY WELEM BATISTA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663285@alunosenai.mt", senha: "663285" },
  { ra: "663280", nome: "KETHYLIN VITÓRIA SOARES DE BRITTO", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663280@alunosenai.mt", senha: "663280" },
  { ra: "654733", nome: "LAIS EMILY DA SILVA COSTA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "654733@alunosenai.mt", senha: "654733" },
  { ra: "663671", nome: "LEONARDO DE SOUZA NEVES", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663671@alunosenai.mt", senha: "663671" },
  { ra: "624110", nome: "LEONARDO RAFAEL FLORES DE LA ROSA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "624110@alunosenai.mt", senha: "624110" },
  { ra: "659647", nome: "LUIZ HENRIQUE DE ARAÚJO TRIBUTINO", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "659647@alunosenai.mt", senha: "659647" },
  { ra: "663293", nome: "LUIZ RENATO VITOR DOS SANTOS", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663293@alunosenai.mt", senha: "663293" },
  { ra: "660329", nome: "MIKAELE VASCONCELOS GUSMAO SANTOS", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "660329@alunosenai.mt", senha: "660329" },
  { ra: "663332", nome: "NATHALY BRANDÃO LESSE", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663332@alunosenai.mt", senha: "663332" },
  { ra: "663303", nome: "PIETRA BEATRIZ PASSOS DE SOUZA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663303@alunosenai.mt", senha: "663303" },
  { ra: "626727", nome: "RAYANNE FERNANDES DE ALMEIDA", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "626727@alunosenai.mt", senha: "626727" },
  { ra: "663661", nome: "SAMARA STHEFANI PEREIRA DE FREITAS", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663661@alunosenai.mt", senha: "663661" },
  { ra: "663701", nome: "THAIS ALLANA OLIVEIRA TOMÉ", turma: "QUA.162.002", curso: "ASSISTENTE ADMINISTRATIVO COM INFORMÁTICA", email: "663701@alunosenai.mt", senha: "663701" },
];

/** Login especial do professor / instrutor */
export const PROFESSOR = {
  ra: "professor",
  nome: "Professor / Instrutor SENAI",
  turma: "DOCENTE",
  curso: "Gestão Operacional",
  email: "professor@senai.mt",
  senha: "senai2026",
};

export function autenticar(login: string, senha: string): Aluno | null {
  const limpo = login.trim();
  // Professor
  if (limpo.toLowerCase() === PROFESSOR.ra && senha === PROFESSOR.senha) {
    return PROFESSOR;
  }
  // Aluno
  const aluno = ALUNOS.find((a) => a.ra === limpo);
  if (aluno && aluno.senha === senha) return aluno;
  return null;
}
