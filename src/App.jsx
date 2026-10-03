import React, { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    if (!savedStudents) {
      return [];
    }

    try {
      const parsedStudents = JSON.parse(savedStudents);
      return Array.isArray(parsedStudents) ? parsedStudents : [];
    } catch (error) {
      console.error("Could not read saved students from localStorage.", error);
      return [];
    }
  });

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  function clearForm() {
    setName("");
    setCourse("");
    setEmail("");
    setEditingId(null);
    setErrorMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !course.trim() || !email.trim()) {
      setErrorMessage("Please fill in all three fields.");
      return;
    }

    const studentDetails = {
      name: name.trim(),
      course: course.trim(),
      email: email.trim(),
    };

    if (editingId !== null) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === editingId
            ? { ...student, ...studentDetails }
            : student
        )
      );
    } else {
      setStudents((currentStudents) => [
        ...currentStudents,
        { id: Date.now(), ...studentDetails },
      ]);
    }

    clearForm();
  }

  function editStudent(student) {
    setName(student.name);
    setCourse(student.course);
    setEmail(student.email);
    setEditingId(student.id);
    setErrorMessage("");
  }

  function deleteStudent(id) {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== id)
    );

    if (editingId === id) {
      clearForm();
    }
  }

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">STUDENT RECORDS</p>
          <h1>Student Manager</h1>
          <p className="subtitle">
            A simple place to add and manage your students.
          </p>
        </div>
        <div className="student-count" aria-live="polite">
          <span className="count-number">{students.length}</span>
          <span>{students.length === 1 ? "student" : "students"}</span>
        </div>
      </header>

      <section className="content">
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <p className="eyebrow">{editingId !== null ? "EDIT RECORD" : "NEW RECORD"}</p>
            <h2>{editingId !== null ? "Update student" : "Add a student"}</h2>
            <p>Enter the student details below.</p>
          </div>

          <label htmlFor="student-name">Student name</label>
          <input
            id="student-name"
            type="text"
            placeholder="e.g. Aanya Sharma"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="student-course">Course</label>
          <input
            id="student-course"
            type="text"
            placeholder="e.g. Web Development"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            required
          />

          <label htmlFor="student-email">Email address</label>
          <input
            id="student-email"
            type="email"
            placeholder="e.g. aanya@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {errorMessage && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingId !== null ? "Save changes" : "Add student"}
            </button>
            {editingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="student-list" aria-labelledby="students-heading">
          <div className="list-heading">
            <div>
              <p className="eyebrow">YOUR CLASS</p>
              <h2 id="students-heading">All students</h2>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                +
              </div>
              <h3>No students yet</h3>
              <p>Add your first student using the form.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">Course</th>
                    <th scope="col">Email</th>
                    <th scope="col">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="student-name">{student.name}</td>
                      <td>{student.course}</td>
                      <td>
                        <a href={`mailto:${student.email}`}>{student.email}</a>
                      </td>
                      <td className="row-actions">
                        <button
                          className="text-button"
                          type="button"
                          onClick={() => editStudent(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-button delete-button"
                          type="button"
                          onClick={() => deleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      <footer className="page-footer">
        Student data is saved in this browser using localStorage.
      </footer>
    </main>
  );
}

export default App;
