"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { supabase } from "./supbaseClient";

interface Group {
  id?: number;
  name: string;
  status: boolean;
}

interface Student {
  id?: number;
  fullname: string;
  age: string;
  groupId: string;
  status: boolean;
}

const StudentUI = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [group, setGroup] = useState<Group>({ name: "", status: false });
  const [student, setStudent] = useState<Student>({
    fullname: "",
    age: "",
    groupId: "",
    status: false,
  });

  useEffect(() => {
    getGroups();
    getStudents();
  }, []);

  async function getGroups() {
    const { data } = await supabase.from("groups").select("*");
    if (data) setGroups(data);
  }

  async function getStudents() {
    const { data } = await supabase.from("students").select("*");
    if (data) setStudents(data);
  }

  function setgroupss() {
    supabase
      .from("groups")
      .insert([{ name: group.name, status: group.status }])
      .then(() => {
        getGroups();
        setShow(false);
        setGroup({ name: "", status: false });
      });
  }

  function setStudentss() {
    if (current) {
      supabase
        .from("students")
        .update({ ...student })
        .eq("id", current)
        .then(() => {
          getStudents();
          setShowModal(false);
          setStudent({ fullname: "", age: "", groupId: "", status: false });
        });
    } else {
      supabase
        .from("students")
        .insert([{ ...student }])
        .then(() => {
          getStudents();
          setShowModal(false);
        });
    }
    setCurrent(null);
    setShowModal(false);
    setStudent({ fullname: "", age: "", groupId: "", status: false });
  }

  function handleDeleteStudent(id: number) {
    supabase
      .from("students")
      .delete()
      .eq("id", id)
      .then(() => {
        getStudents();
      });
  }

  function handleEditStudent(id: number) {
    setCurrent(id);
    setShowModal(true);
    const studentToEdit = students.find((student) => student.id === id);
    if (studentToEdit) {
      setStudent(studentToEdit);
    }
  }

  function FilterbyGroup(id: number) {
    supabase
      .from("students")
      .select("*")
      .eq("groupId", id)
      .then(({ data }) => {
        if (data) setStudents(data);
      });
  }

  function searchbyGroup(id: number) {
    supabase
      .from("students")
      .select("*")
      .eq("groupId", id)
      .then(({ data }) => {
        if (data) setStudents(data);
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto border-4 border-blue-900 p-2 sm:p-4 bg-white rounded-xl shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <button
              className="btn btn-primary w-full"
              onClick={() => setShow(true)}
            >
              Add group
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => FilterbyGroup(group.id!)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-left py-2 px-4 rounded-lg"
              >
                {group.name}
              </button>
            ))}
          </div>

          <div className="sm:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 gap-2 sm:gap-5">
              <input
                type="text"
                placeholder="Search by groupId..."
                className="form-control w-full sm:w-3/4"
                onChange={(e) => searchbyGroup(Number(e.target.value))}
              />
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-success w-full sm:w-1/4"
              >
                Add student
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-bordered table-striped min-w-full">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Fullname</th>
                    <th>Age</th>
                    <th>Active</th>
                    <th>GroupId</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">
                        No items yet
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{student.fullname}</td>
                        <td>{student.age}</td>
                        <td>{student.status ? "Active" : "Block"}</td>
                        <td>{student.groupId}</td>
                        <td>
                          <button
                            onClick={() => handleEditStudent(student.id!)}
                            className="btn btn-warning m-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id!)}
                            className="btn btn-danger m-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Group Modal */}
        {show && (
          <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Group informations</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShow(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Group name..."
                    value={group.name}
                    onChange={(e) =>
                      setGroup({ ...group, name: e.target.value })
                    }
                  />
                  <div className="form-check form-switch mb-2">
                    <label className="form-check-label" htmlFor="groupStatus">
                      Group status:
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="groupStatus"
                      checked={group.status}
                      onChange={(e) =>
                        setGroup({ ...group, status: e.target.checked })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={setgroupss}
                    type="button"
                    className="btn btn-primary"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Modal */}
        {showModal && (
          <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Student informations</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Fullname..."
                    value={student.fullname}
                    onChange={(e) =>
                      setStudent({ ...student, fullname: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Age..."
                    value={student.age}
                    onChange={(e) =>
                      setStudent({ ...student, age: e.target.value })
                    }
                  />
                  <select
                    className="form-select mb-2"
                    value={student.groupId}
                    onChange={(e) =>
                      setStudent({ ...student, groupId: e.target.value })
                    }
                  >
                    <option value="">Select group</option>
                    {groups.map((group) => (
                      <option key={group.id} value={String(group.id)}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-check form-switch mb-2">
                    <label
                      className="form-check-label"
                      htmlFor="studentStatus"
                    >
                      Student status:
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="studentStatus"
                      checked={student.status}
                      onChange={(e) =>
                        setStudent({ ...student, status: e.target.checked })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={setStudentss}
                    type="button"
                    className="btn btn-primary"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentUI;
