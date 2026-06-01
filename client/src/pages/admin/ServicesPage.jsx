import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Header } from "@/pages/public/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit2, Check, AlertCircle } from "lucide-react";
import { resolveMediaUrl } from "@/services/api";
import { useToast } from "@/context/ToastContext";

export default function ServicesPage() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const loadServices = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.service.list();
      const servicesData = Array.isArray(data) ? data : data?.results || [];
      setServices(servicesData);
    } catch (err) {
      const message = err?.payload?.detail || "Failed to load services";
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description || "");
      if (formData.image) {
        payload.append("image", formData.image);
      }

      if (editing) {
        await api.service.patch(editing.id, payload);
        setMessage("Service updated successfully!");
        addToast("Service updated successfully!", "success");
      } else {
        await api.service.create(payload);
        setMessage("Service created successfully!");
        addToast("Service created successfully!", "success");
      }
      setFormData({ name: "", description: "", image: null });
      setEditing(null);
      await loadServices();
    } catch (err) {
      const message = err?.payload?.detail || "Failed to save service";
      setError(message);
      addToast(message, "error");
    }
  };

  const handleEdit = (service) => {
    setEditing(service);
    setFormData({ name: service.name, description: service.description || "", image: null });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setError("");
    try {
      await api.service.delete(id);
      await loadServices();
      setMessage("Service deleted successfully!");
      addToast("Service deleted successfully!", "success");
    } catch (err) {
      const message = err?.payload?.detail || "Failed to delete service";
      setError(message);
      addToast(message, "error");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ name: "", description: "", image: null });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900">Services</h1>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="space-y-6 pb-8 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-zinc-900">Manage Services</h1>

      {message && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-700">{message}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Service" : "Add New Service"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Plumbing, Electrical, Carpentry"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the service..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="image">Service Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {editing?.image && !formData.image && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-zinc-500">Current image</p>
                  <img
                    src={resolveMediaUrl(editing.image)}
                    alt={editing.name}
                    className="h-28 w-28 rounded-lg object-cover border"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                {editing ? "Update Service" : "Add Service"}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Services</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-zinc-500">No services added yet.</p>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-start gap-4">
                      {service.image && (
                        <img
                          src={resolveMediaUrl(service.image)}
                          alt={service.name}
                          className="h-16 w-16 rounded-lg object-cover border"
                        />
                      )}
                      <div>
                      <p className="font-semibold text-zinc-900">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-zinc-600 mt-1">{service.description}</p>
                      )}
                      <p className="text-xs text-zinc-500 mt-2">ID: {service.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(service)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(service.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
