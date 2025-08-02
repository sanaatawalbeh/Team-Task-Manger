import { useState } from "react";
import axios from "axios";
import "./CreateTeam.css"
export default function CreateTeam() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // تأكد إنك مخزن التوكن
      const response = await axios.post(
        "/team/create",
        { name, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Team "${response.data.name}" created successfully!`);
      setName("");
      setCode("");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center text-purple-700">
        Create a New Team
      </h2>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Team Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="e.g. Frontend Team"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Team Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="e.g. TEAM123"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition"
        >
          Create Team
        </button>

        {message && (
          <p className="text-green-600 text-sm text-center mt-2">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}
