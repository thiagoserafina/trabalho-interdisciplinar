"use client";

import  { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale"; 
import "./styles.css";
import 'animate.css';
import Layout from "../components/layout";

const students = [
  { id: "0001", name: "José Carlos", dob: "01/02/2007", contact: "(48) 91234-5678", diagnosis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: "0002", name: "Ana Maria", dob: "01/02/2006", contact: "(48) 91234-5678", diagnosis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: "0003", name: "Carlos Silva", dob: "01/02/2005", contact: "(48) 91234-5678", diagnosis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: "0004", name: "Carlos Silva", dob: "01/02/2005", contact: "(48) 91234-5678", diagnosis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: "0005", name: "Carlos Silva", dob: "01/02/2005", contact: "(48) 91234-5678", diagnosis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: "0006", name: "Carlos Silva", dob: "01/02/2005", contact: "(48) 91234-5678", diagnosis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: "0007", name: "Carlos Silva", dob: "01/02/2005", contact: "(48) 91234-5678", diagnosis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
];

const StudentsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedStudent, setEditedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const [newStudent, setNewStudent] = useState({
    name: "",
    dateOfBirth: "",
    responsibleContact: "",
    diagnosis: "",
  });
 

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

  const handleSave = () => {
    console.log("Dados salvos:", editedStudent);
    closeDrawer();
  };

  const handleModalSubmit = () => {
    console.log("Novo profissional:", newStudent);
    alert("Novo profissional adicionado com sucesso!");
    setIsModalOpen(false);
  };

  const handleInputStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
   <Layout>
          <div className="students-page">
            <div className="header">
              <h2>Alunos</h2>
            </div>
            <button className="new-student-button" onClick={() => setIsModalOpen(true)}>+ Novo aluno
                  
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
                    <tr key={student.id}>
                      <td className="student-id">{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.dob}</td>
                      <td>{student.contact}</td>
                      <td className="diagnosis">{student.diagnosis}</td>
                      <td className="actions">
                        <EllipsisVertical size={20} onClick={() => openDrawer(student)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button><ArrowLeft size={18} /></button>
                <span>1</span>
                <button><ArrowRight size={18} /></button>
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
                        <div className="student-info">                       
                          <h2 className="student-name">{editedStudent?.name}</h2>
                          <p className="student-id">{editedStudent?.id}</p>
                        </div>
                      </div>
                      <form>
                        <label htmlFor="name">Nome do aluno:</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editedStudent.name}
                          onChange={handleInputChange}
                          className={`input-field ${isEditing ? "editing" : ""}`}
                          disabled={!isEditing}
                        />

                        <label htmlFor="dob">Data de nascimento:</label>
                        <DatePicker
                          id="dob"
                          name="dob"
                          selected={new Date(editedStudent.dob)}
                          onChange={(date) => setEditedStudent((prev) => ({ ...prev, dob: date }))}
                          locale={ptBR}
                          dateFormat="dd/MM/yyyy"
                          className={`input-field ${isEditing ? "editing" : ""}`}
                          disabled={!isEditing}
                        />

                        <label htmlFor="contact">Contato do responsável:</label>
                        <input
                          type="tel"
                          id="contact"
                          name="contact"
                          value={editedStudent.contact}
                          onChange={handleInputChange}
                          className={`input-field ${isEditing ? "editing" : ""}`}
                          disabled={!isEditing}
                        />

                        <label htmlFor="diagnosis">Diagnóstico:</label>
                        <textarea
                          id="diagnosis"
                          name="diagnosis"
                          value={editedStudent.diagnosis}
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
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                    <button className="close-button" onClick={() => setIsModalOpen(false)}>
                      <X size={18} />
                    </button>
                    <div className="header">
                      <h2>Adicionar novo aluno</h2>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="mb-4 mt-6">
                        <label className="block text-sm font-semibold mb-1">Nome</label>
                        <input
                          type="text"
                          name="name"
                          value={newStudent.name}
                          onChange={handleInputStudentChange}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1">Data de nascimento</label>
                        <DatePicker
                          name="dateOfBirth"
                          selected={newStudent.dateOfBirth ? parseDate(newStudent.dateOfBirth) : null}
                          onChange={(date) =>
                            setNewStudent((prev) => ({
                              ...prev,
                              dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                            }))
                          }
                          locale={ptBR}
                          dateFormat="dd/MM/yyyy"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholderText="Selecione a data de nascimento"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1">Contato do responsável</label>
                        <input
                          type="text"
                          name="responsibleContact"
                          value={newStudent.responsibleContact}
                          onChange={handleInputStudentChange}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1">Diagnóstico</label>
                        <textarea
                          name="diagnosis"
                          value={newStudent.diagnosis}
                          onChange={handleInputStudentChange}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          className="bg-yellow-400 text-black px-4 py-2 rounded-md shadow hover:bg-yellow-500"
                          onClick={handleModalSubmit}
                        >
                          Adicionar
                        </button>
                        <button
                          type="button"
                          className="bg-gray-200 text-black px-4 py-2 rounded-md shadow hover:bg-gray-300"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

          </div>   
   </Layout>
  );
};

export default StudentsPage;
