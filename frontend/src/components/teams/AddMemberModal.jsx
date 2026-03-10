/** Add-member form modal for a specific team. */
import { useState } from "react";
import { addMember, inviteMember } from "../../api/teams";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

export default function AddMemberModal({ team, onClose, onUpdated }) {
  const [userId, setUserId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [tab, setTab] = useState("id"); // "id" | "invite"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddById = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const { data } = await addMember(team.id, parseInt(userId, 10));
      setSuccess(`User added to ${team.name}!`);
      setUserId("");
      if (onUpdated) onUpdated(data);
    } catch (err) {
      const d = err.response?.data;
      setError(
        d?.user_id?.[0] || d?.detail || "Failed to add member."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const { data } = await inviteMember(team.id, inviteEmail);
      setSuccess(data.detail || "Invite sent!");
      setInviteEmail("");
    } catch (err) {
      const d = err.response?.data;
      setError(d?.email?.[0] || d?.detail || "Failed to send invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Manage Members — ${team.name}`} onClose={onClose} maxWidth="max-w-md">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg mb-6">
        {[["id", "Add by User ID"], ["invite", "Invite by Email"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setError(""); setSuccess(""); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
              tab === key ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error   && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {success && <p className="text-emerald-400 text-sm mb-4">{success}</p>}

      {tab === "id" ? (
        <form onSubmit={handleAddById} className="space-y-4">
          <Input
            id="member-user-id"
            label="User ID"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter the user's ID number"
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Add Member
          </Button>
        </form>
      ) : (
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            id="invite-email"
            label="Email address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
          />
          <p className="text-xs text-slate-500">
            Invite email delivery is stubbed — the invite will be recorded without sending a real email.
          </p>
          <Button type="submit" loading={loading} variant="success" className="w-full">
            Send Invite
          </Button>
        </form>
      )}
    </Modal>
  );
}
