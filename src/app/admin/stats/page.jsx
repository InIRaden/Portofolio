"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSave, FiRefreshCw, FiPlus, FiTrash } from "react-icons/fi";

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [creating, setCreating] = useState(false);
  const [newStat, setNewStat] = useState({ stat_key: "", stat_label: "", stat_value: 0, display_order: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setMessage({ type: "error", text: "Failed to load stats" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedStats = [...stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: field === 'stat_value' ? parseInt(value) || 0 : value
    };
    setStats(updatedStats);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/stats", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stats }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Stats updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update stats" });
      }
    } catch (error) {
      console.error("Error saving stats:", error);
      setMessage({ type: "error", text: "Failed to save stats" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchStats();
    setMessage({ type: "info", text: "Stats reset to saved values" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleCreate = async () => {
    if (!newStat.stat_key || !newStat.stat_label) {
      setMessage({ type: "error", text: "stat_key dan label wajib diisi" });
      return;
    }
    setCreating(true);
    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStat)
      });
      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Stat berhasil ditambahkan/diupdate' });
        setNewStat({ stat_key: "", stat_label: "", stat_value: 0, display_order: 0 });
        await fetchStats();
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menambahkan stat' });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menambahkan stat' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (stat_key) => {
    if (!confirm(`Hapus stat ${stat_key}?`)) return;
    try {
      const response = await fetch(`/api/stats?key=${encodeURIComponent(stat_key)}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Stat dihapus' });
        await fetchStats();
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menghapus stat' });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menghapus stat' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Manage Stats</h1>
          <p className="text-white/60 text-sm sm:text-base">
            Update the statistics shown on your homepage
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className={saving ? "animate-spin" : ""} />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <FiSave />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-500"
              : message.type === "error"
              ? "bg-red-500/10 border border-red-500/20 text-red-500"
              : "bg-blue-500/10 border border-blue-500/20 text-blue-500"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Add New Stat */}
      <div className="bg-[#27272c] p-6 rounded-xl border border-accent/10 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Stat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="stat_key (unik)"
            value={newStat.stat_key}
            onChange={(e) => setNewStat({ ...newStat, stat_key: e.target.value.trim() })}
            className="w-full"
          />
        
          <Input
            placeholder="Label"
            value={newStat.stat_label}
            onChange={(e) => setNewStat({ ...newStat, stat_label: e.target.value })}
            className="w-full"
          />

          <Input
            type="number"
            placeholder="Value"
            value={newStat.stat_value}
            onChange={(e) => setNewStat({ ...newStat, stat_value: parseInt(e.target.value) || 0 })}
            className="w-full"
          />

          <Input
            type="number"
            placeholder="Order"
            value={newStat.display_order}
            onChange={(e) => setNewStat({ ...newStat, display_order: parseInt(e.target.value) || 0 })}
            className="w-full"
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleCreate} disabled={creating} className="flex items-center gap-2">
            <FiPlus />
            {creating ? 'Adding...' : 'Add Stat'}
          </Button>
        </div>
      </div>

      {/* Stats Form */}
      <div className="bg-[#27272c] p-6 rounded-xl border border-accent/10 shadow-lg">
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-accent/5 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-accent">
                  Stat #{index + 1}
                </h3>
                <span className="text-sm text-white/40 font-mono">
                  {stat.stat_key}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(stat.stat_key)}
                  className="ml-4 flex items-center gap-2"
                >
                  <FiTrash /> Delete
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">
                    Value (Number)
                  </label>
                  <Input
                    type="number"
                    value={stat.stat_value}
                    onChange={(e) =>
                      handleInputChange(index, "stat_value", e.target.value)
                    }
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">
                    Label
                  </label>
                  <Input
                    type="text"
                    value={stat.stat_label}
                    onChange={(e) =>
                      handleInputChange(index, "stat_label", e.target.value)
                    }
                    className="w-full"
                    placeholder="Enter label"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/40 mb-2">Preview:</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-accent">
                    {stat.stat_value}
                  </span>
                  <span className="text-sm text-white/80">{stat.stat_label}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-400 mb-2">💡 Tips</h4>
        <ul className="text-sm text-white/60 space-y-1">
          <li>• Keep your stats numbers realistic and up-to-date</li>
          <li>• Use clear, concise labels that visitors can understand quickly</li>
          <li>• Stats are displayed on your homepage in the order shown here</li>
          <li>• Changes will be reflected immediately after saving</li>
        </ul>
      </div>
    </motion.div>
  );
}
