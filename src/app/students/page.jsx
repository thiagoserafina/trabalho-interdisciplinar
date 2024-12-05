"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import "./styles.css";
import "animate.css";
import Layout from "../components/layout";
import {
  addStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "@/service/api";
import { format } from "date-fns";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedStudent, setEditedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newStudent, setNewStudent] = useState({
    nome_aluno: "",
    data_nascimento: "",
    contato_responsavel: "",
    diagnostico: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await getStudents();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const openDrawer = (student) => {
    setSelectedStudent(student);
    setEditedStudent({ ...student });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedStudent(null);
    setEditedStudent(null);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editedStudent) {
      await updateStudent(editedStudent.id_aluno, editedStudent);
      const updatedStudents = await getStudents();
      setStudents(updatedStudents);
    }
    closeDrawer();
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    const updatedStudents = await getStudents();
    setStudents(updatedStudents);
    closeDrawer();
  };

  const handleModalSubmit = async () => {
    await addStudent(newStudent);
    const updatedStudents = await getStudents();
    setStudents(updatedStudents);
    setIsModalOpen(false);
  };

  const handleInputStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <Layout>
      <div className="students-page">
        <div className="header">
          <h2>Alunos</h2>
        </div>
        <button
          className="new-student-button"
          onClick={() => setIsModalOpen(true)}
        >
          + Novo aluno
        </button>
        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Aluno</th>
                <th>Data nascimento</th>
                <th>Contato responsável</th>
                <th className="diagnosis-title">Diagnóstico</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id_aluno}>
                  <td className="student-id">{student.id_aluno}</td>
                  <td>{student.nome_aluno}</td>
                  <td>
                    {student.data_nascimento
                      ? format(new Date(student.data_nascimento), "dd/MM/yyyy")
                      : ""}
                  </td>
                  <td>{formatPhoneNumber(student.contato_responsavel)}</td>
                  <td className="diagnosis">{student.diagnostico}</td>
                  <td className="actions">
                    <EllipsisVertical
                      size={20}
                      onClick={() => openDrawer(student)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button>
              <ArrowLeft size={18} />
            </button>
            <span>1</span>
            <button>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {isDrawerOpen && (
          <div className="drawer animate__slideInRight">
            <div className="drawer-content">
              <button className="close-button" onClick={closeDrawer}>
                <X size={18} />
              </button>
              {editedStudent && (
                <>
                  <div className="drawer-header">
                    <h2>{editedStudent.nome_aluno}</h2>
                    <p>ID: {editedStudent.id_aluno}</p>
                  </div>
                  <form>
                    <label htmlFor="nome_aluno">Nome do aluno:</label>
                    <input
                      type="text"
                      id="nome_aluno"
                      name="nome_aluno"
                      value={editedStudent.nome_aluno}
                      onChange={handleInputChange}
                      className={`input-field ${isEditing ? "editing" : ""}`}
                      disabled={!isEditing}
                    />

                    <label htmlFor="data_nascimento">Data de nascimento:</label>
                    <DatePicker
                      id="data_nascimento"
                      name="data_nascimento"
                      selected={
                        editedStudent.data_nascimento
                          ? new Date(editedStudent.data_nascimento)
                          : null
                      }
                      onChange={(date) =>
                        setEditedStudent((prev) => ({
                          ...prev,
                          data_nascimento: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        }))
                      }
                      locale={ptBR}
                      dateFormat="dd/MM/yyyy"
                      className={`input-field ${isEditing ? "editing" : ""}`}
                      disabled={!isEditing}
                    />

                    <label htmlFor="contato_responsavel">
                      Contato do responsável:
                    </label>
                    <input
                      type="tel"
                      id="contato_responsavel"
                      name="contato_responsavel"
                      value={editedStudent.contato_responsavel}
                      onChange={handleInputChange}
                      className={`input-field ${isEditing ? "editing" : ""}`}
                      disabled={!isEditing}
                    />

                    <label htmlFor="diagnostico">Diagnóstico:</label>
                    <textarea
                      id="diagnostico"
                      name="diagnostico"
                      value={editedStudent.diagnostico}
                      onChange={handleInputChange}
                      className={`input-field ${isEditing ? "editing" : ""}`}
                      disabled={!isEditing}
                    />
                  </form>

                  <div className="button-group">
                    <button
                      className="save-button"
                      onClick={handleSave}
                      disabled={!isEditing}
                    >
                      Salvar
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => setIsEditing(true)}
                      disabled={isEditing}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(editedStudent.id_aluno)}
                    >
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modalOverlay">
            <div className="modal">
              <div className="modal-content">
                <button
                  className="close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={18} />
                </button>
                <h2 className="title">Adicionar novo aluno</h2>
                <form className="form-group">
                  <label htmlFor="nome_aluno">Nome:</label>
                  <input
                    type="text"
                    id="nome_aluno"
                    name="nome_aluno"
                    value={newStudent.nome_aluno}
                    onChange={handleInputStudentChange}
                  />

                  <label htmlFor="data_nascimento">Data de nascimento:</label>
                  <DatePicker
                    name="data_nascimento"
                    selected={
                      newStudent.data_nascimento
                        ? new Date(newStudent.data_nascimento)
                        : null
                    }
                    onChange={(date) =>
                      setNewStudent((prev) => ({
                        ...prev,
                        data_nascimento: date
                          ? date.toISOString().split("T")[0]
                          : "",
                      }))
                    }
                    locale={ptBR}
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholderText="Selecione a data de nascimento"
                  />

                  <label htmlFor="contato_responsavel">
                    Contato do responsável:
                  </label>
                  <input
                    type="tel"
                    id="contato_responsavel"
                    name="contato_responsavel"
                    value={newStudent.contato_responsavel}
                    onChange={handleInputStudentChange}
                  />

                  <label htmlFor="cpf">CPF:</label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={newStudent.cpf}
                    onChange={handleInputStudentChange}
                  />

                  <label htmlFor="diagnostico">Diagnóstico:</label>
                  <textarea
                    id="diagnostico"
                    name="diagnostico"
                    value={newStudent.diagnostico}
                    onChange={handleInputStudentChange}
                  />

                  <button
                    type="button"
                    className="addButton"
                    onClick={handleModalSubmit}
                  >
                    Adicionar
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentsPage;
