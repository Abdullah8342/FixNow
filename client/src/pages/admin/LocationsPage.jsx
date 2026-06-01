import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Header } from "@/pages/public/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit2, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function LocationsPage() {
  const { addToast } = useToast();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    area: "",
  });

  const loadLocations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.helper.locationList();
      const locationsData = Array.isArray(data) ? data : data?.results || [];
      setLocations(locationsData);
    } catch (err) {
      const message = err?.payload?.detail || "Failed to load locations";
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editing) {
        await api.helper.locationPatch(editing.id, formData);
        setMessage("Location updated successfully!");
        addToast("Location updated successfully!", "success");
      } else {
        await api.helper.locationCreate(formData);
        setMessage("Location created successfully!");
        addToast("Location created successfully!", "success");
      }
      setFormData({ country: "", city: "", area: "" });
      setEditing(null);
      await loadLocations();
    } catch (err) {
      const message = err?.payload?.detail || "Failed to save location";
      setError(message);
      addToast(message, "error");
    }
  };

  const handleEdit = (location) => {
    setEditing(location);
    setFormData({ country: location.country, city: location.city, area: location.area });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    setError("");
    try {
      await api.helper.locationDelete(id);
      await loadLocations();
      setMessage("Location deleted successfully!");
      addToast("Location deleted successfully!", "success");
    } catch (err) {
      const message = err?.payload?.detail || "Failed to delete location";
      setError(message);
      addToast(message, "error");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ country: "", city: "", area: "" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900">Locations</h1>
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
      <h1 className="text-3xl font-bold text-zinc-900">Manage Locations</h1>

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
          <CardTitle>{editing ? "Edit Location" : "Add New Location"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="e.g., Pakistan"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., Karachi"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  name="area"
                  placeholder="e.g., Defense"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                {editing ? "Update Location" : "Add Location"}
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
          <CardTitle>Existing Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <p className="text-zinc-500">No locations added yet.</p>
          ) : (
            <div className="space-y-2">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50"
                >
                  <div>
                    <p className="font-medium text-zinc-900">
                      {location.country} • {location.city} • {location.area}
                    </p>
                    <p className="text-xs text-zinc-500">ID: {location.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(location)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(location.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
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
