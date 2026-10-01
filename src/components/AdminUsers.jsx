import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  PlusIcon,
  TrashIcon,
  LoadingSpinner,
} from "../components/Icons";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = () => {
    setLoading(true);

    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/users")
      .then((res) => {
        if (!cancelled) {
          setUsers(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load users");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/admin/users", form);
      toast.success("User created successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted");
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  return (
    <section className="admin-users">
      <div className="admin-section-header">
        <h2>User Management</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <PlusIcon />
          {showForm ? "Cancel" : "Create User"}
        </button>
      </div>

      {showForm && (
        <form className="admin-form admin-user-form" onSubmit={handleCreate}>
          <h3>Create New User</h3>

          <div className="form-group">
            <label htmlFor="userName">
              <UserIcon />
              Full Name
            </label>

            <input
              id="userName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">
              <MailIcon />
              Email
            </label>

            <input
              id="userEmail"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userPassword">
              <LockIcon />
              Password
            </label>

            <input
              id="userPassword"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userRole">Role</label>

            <select
              id="userRole"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create User"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner className="initial-loader" />
        </div>
      ) : (
        <div className="admin-list">
          {users.map((u) => (
            <div key={u.id} className="admin-row">
              <div>
                <strong>{u.name}</strong>
                <p className="admin-row-meta">{u.email}</p>
              </div>

              <div className="admin-row-actions admin-user-actions">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="admin-role-select"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                <button
                  className="btn btn-danger admin-delete-button"
                  onClick={() => handleDelete(u.id)}
                >
                  <TrashIcon />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
