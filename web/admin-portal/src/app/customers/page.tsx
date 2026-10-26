"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Car,
  Plus,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  SlidersHorizontal,
  Trash2,
  Edit3,
  Ban,
  Check,
  X,
  AlertTriangle,
  Smartphone,
  MapPin,
  Mail,
  ArrowRight,
  ExternalLink,
  Key,
} from "lucide-react";
import {
  getCustomers,
  saveCustomer,
  updateCustomerProfile,
  deleteCustomer,
  blockCustomer,
  unblockCustomer,
  verifyCustomerData,
  rejectCustomerVerification,
  addVehicleToCustomer,
  updateCustomerVehicle,
  deleteCustomerVehicle,
  setActiveCustomerId,
  getActiveCustomer,
  generateUniqueCustomerPin,
  isPinTaken,
  Customer,
  CustomerVehicle,
  DEFAULT_CUSTOMERS,
} from "@/lib/userStore";

export default function CustomersManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VERIFIED" | "PENDING" | "BLOCKED">("ALL");
  const [notification, setNotification] = useState<string | null>(null);

  // Modals
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<string | null>(null); // customerId
  const [editingVehicle, setEditingVehicle] = useState<{ customerId: string; vehicle: CustomerVehicle } | null>(null);
  const [blockingCustomer, setBlockingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [verifyingCustomer, setVerifyingCustomer] = useState<Customer | null>(null);

  // Form States - Add Customer
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("Vidisha");
  const [newAddress, setNewAddress] = useState("");
  const [newEmergency, setNewEmergency] = useState("");
  const [newEmergencyPhone, setNewEmergencyPhone] = useState("");
  const [initialCarBrand, setInitialCarBrand] = useState("");
  const [initialCarModel, setInitialCarModel] = useState("");
  const [initialCarPlate, setInitialCarPlate] = useState("");
  const [initialCarTrans, setInitialCarTrans] = useState<"AUTOMATIC" | "MANUAL" | "LUXURY">("AUTOMATIC");
  const [newPin, setNewPin] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [vehicleError, setVehicleError] = useState<string | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<{ customerId: string; vehicleId: string; vehicleName: string } | null>(null);

  // Form States - Add/Edit Vehicle
  const [vehBrand, setVehBrand] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehPlate, setVehPlate] = useState("");
  const [vehTrans, setVehTrans] = useState<"AUTOMATIC" | "MANUAL" | "LUXURY">("AUTOMATIC");
  const [vehColor, setVehColor] = useState("");
  const [vehYear, setVehYear] = useState(2024);

  // Block Reason Form
  const [blockReason, setBlockReason] = useState("Customer requested temporary freeze");

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const resetAddCustomerForm = () => {
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewCity("Vidisha");
    setNewAddress("");
    setNewEmergency("");
    setNewEmergencyPhone("");
    setInitialCarBrand("");
    setInitialCarModel("");
    setInitialCarPlate("");
    setInitialCarTrans("AUTOMATIC");
    setNewPin(generateUniqueCustomerPin());
    setFormError(null);
  };

  const refresh = () => {
    setCustomers(getCustomers());
  };

  useEffect(() => {
    refresh();
  }, []);

  // Filtered customers
  const filteredCustomers = customers.filter((cust) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      cust.fullName.toLowerCase().includes(q) ||
      cust.phone.toLowerCase().includes(q) ||
      cust.email.toLowerCase().includes(q) ||
      cust.city.toLowerCase().includes(q) ||
      (cust.permanentPin && cust.permanentPin.includes(q)) ||
      cust.vehicles.some(
        (v) =>
          v.plate.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q)
      );

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "BLOCKED"
        ? cust.isBlocked
        : statusFilter === "VERIFIED"
        ? cust.verificationStatus === "VERIFIED" && !cust.isBlocked
        : cust.verificationStatus !== "VERIFIED" && !cust.isBlocked;

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = customers.length;
  const verifiedCount = customers.filter((c) => c.verificationStatus === "VERIFIED" && !c.isBlocked).length;
  const pendingCount = customers.filter((c) => c.verificationStatus !== "VERIFIED" && !c.isBlocked).length;
  const blockedCount = customers.filter((c) => c.isBlocked).length;
  const totalVehicles = customers.reduce((acc, c) => acc + (c.vehicles?.length || 0), 0);

  // Handlers
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nameTrimmed = newName.trim();
    const phoneTrimmed = newPhone.trim();

    if (!nameTrimmed) {
      setFormError("Customer Full Name is required.");
      return;
    }
    if (!phoneTrimmed || phoneTrimmed.replace(/\D/g, "").length < 10) {
      setFormError("Valid 10-digit mobile number is required.");
      return;
    }

    const finalPin = newPin.trim() || generateUniqueCustomerPin();
    if (!/^\d{4}$/.test(finalPin)) {
      setFormError("Permanent Sathi PIN must be exactly 4 digits (e.g. 4892).");
      return;
    }
    if (isPinTaken(finalPin)) {
      setFormError(`PIN ${finalPin} is already assigned to another customer! Click 'Generate Another PIN' or enter a unique PIN.`);
      return;
    }

    const initialVehicles: CustomerVehicle[] = [];
    if (initialCarBrand.trim() || initialCarPlate.trim()) {
      initialVehicles.push({
        id: `veh-${Date.now()}`,
        brand: initialCarBrand.trim() || "Automobile",
        model: initialCarModel.trim() || "Sedan",
        plate: initialCarPlate.trim().toUpperCase(),
        transmission: initialCarTrans,
        year: 2024,
      });
    }

    const created = saveCustomer({
      fullName: nameTrimmed,
      phone: phoneTrimmed.startsWith("+91") ? phoneTrimmed : `+91 ${phoneTrimmed}`,
      email: newEmail.trim() || `${nameTrimmed.toLowerCase().replace(/\s+/g, "")}@example.com`,
      city: newCity.trim() || "Vidisha",
      address: newAddress.trim() || "Vidisha (M.P.)",
      emergencyContact: newEmergency.trim(),
      emergencyPhone: newEmergencyPhone.trim(),
      permanentPin: finalPin,
      vehicles: initialVehicles,
      verificationStatus: "VERIFIED",
      phoneVerified: true,
      aadhaarVerified: true,
    });

    refresh();
    resetAddCustomerForm();
    setShowAddCustomerModal(false);
    notify(`Customer "${created.fullName}" created with permanent PIN ${created.permanentPin}`);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setEditError(null);

    if (editingCustomer.permanentPin) {
      const pinTrimmed = editingCustomer.permanentPin.trim();
      if (!/^\d{4}$/.test(pinTrimmed)) {
        setEditError("Permanent Sathi PIN must be exactly 4 digits (e.g. 4892).");
        return;
      }
      if (isPinTaken(pinTrimmed, editingCustomer.id)) {
        setEditError(`PIN ${pinTrimmed} is already assigned to another customer! Please choose a unique PIN.`);
        return;
      }
    }

    updateCustomerProfile(editingCustomer.id, {
      fullName: editingCustomer.fullName.trim(),
      phone: editingCustomer.phone.trim(),
      email: editingCustomer.email.trim(),
      city: editingCustomer.city.trim(),
      address: editingCustomer.address.trim(),
      emergencyContact: editingCustomer.emergencyContact?.trim(),
      emergencyPhone: editingCustomer.emergencyPhone?.trim(),
      permanentPin: editingCustomer.permanentPin.trim(),
    });

    refresh();
    setEditingCustomer(null);
    notify(`Profile updated for ${editingCustomer.fullName} (PIN: ${editingCustomer.permanentPin})`);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleError(null);
    if (!showAddVehicleModal || !vehBrand.trim() || !vehPlate.trim()) {
      setVehicleError("Brand and License Plate are required.");
      return;
    }

    addVehicleToCustomer(showAddVehicleModal, {
      brand: vehBrand.trim(),
      model: vehModel.trim() || "Model",
      plate: vehPlate.trim().toUpperCase(),
      transmission: vehTrans,
      color: vehColor.trim() || "White",
      year: vehYear || 2024,
    });

    refresh();
    setShowAddVehicleModal(null);
    setVehBrand("");
    setVehModel("");
    setVehPlate("");
    setVehColor("");
    notify("Vehicle added to customer garage.");
  };

  const handleUpdateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    updateCustomerVehicle(editingVehicle.customerId, {
      ...editingVehicle.vehicle,
      plate: editingVehicle.vehicle.plate.toUpperCase(),
    });

    refresh();
    setEditingVehicle(null);
    notify("Vehicle details updated.");
  };

  const confirmDeleteVehicle = () => {
    if (!deletingVehicle) return;
    deleteCustomerVehicle(deletingVehicle.customerId, deletingVehicle.vehicleId);
    refresh();
    notify(`Vehicle ${deletingVehicle.vehicleName} removed.`);
    setDeletingVehicle(null);
  };

  const handleToggleBlock = () => {
    if (!blockingCustomer) return;

    if (blockingCustomer.isBlocked) {
      unblockCustomer(blockingCustomer.id);
      notify(`Account unblocked: ${blockingCustomer.fullName}`);
    } else {
      blockCustomer(blockingCustomer.id, blockReason);
      notify(`Account suspended: ${blockingCustomer.fullName}`);
    }

    refresh();
    setBlockingCustomer(null);
  };

  const handleDeleteCustomer = () => {
    if (!deletingCustomer) return;
    deleteCustomer(deletingCustomer.id);
    refresh();
    setDeletingCustomer(null);
    notify(`Deleted customer account: ${deletingCustomer.fullName}`);
  };

  const handleSetSimulatorCustomer = (cust: Customer) => {
    setActiveCustomerId(cust.id);
    notify(`Switched active simulator passenger to ${cust.fullName}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-4 h-4 text-slate-100" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Customers &amp; Garage Directory
              </h1>
              <p className="text-xs text-slate-500">
                Registered passengers, vehicle garage, phone &amp; Aadhaar verification, and access controls.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/drivers"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <span>Go to Chauffeurs Fleet</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            onClick={() => {
              resetAddCustomerForm();
              setShowAddCustomerModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Metrics Row - Clean, Minimalist Enterprise Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Total Customers
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Registered accounts</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Verified Identity</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{verifiedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Phone &amp; KYC confirmed</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Garage Vehicles
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalVehicles}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Automobiles registered</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Suspended</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{blockedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Booking restricted</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, plate, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">Filter:</span>
          {(["ALL", "VERIFIED", "PENDING", "BLOCKED"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                statusFilter === filter
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter === "ALL"
                ? `All (${totalCount})`
                : filter === "VERIFIED"
                ? `Verified (${verifiedCount})`
                : filter === "PENDING"
                ? `Pending (${pendingCount})`
                : `Blocked (${blockedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No customers found</p>
            <p className="mt-1">Try adjusting your search query or clear active filters.</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className={`bg-white rounded-xl p-5 border transition-all shadow-xs ${
                cust.isBlocked ? "border-rose-200 bg-rose-50/15" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Customer Info */}
                <div className="space-y-1.5 min-w-[280px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{cust.fullName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 shadow-2xs" title="Permanent Sathi PIN for this Customer">
                      <Key className="w-3 h-3 text-blue-600" />
                      <span>PIN: {cust.permanentPin || "NOT ASSIGNED"}</span>
                    </span>
                    {cust.isBlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        BLOCKED
                      </span>
                    ) : cust.verificationStatus === "VERIFIED" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending KYC
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{cust.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{cust.email}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{cust.city}</span>
                    </span>
                  </div>

                  {cust.address && (
                    <div className="text-[11px] text-slate-400">
                      Address: {cust.address}
                    </div>
                  )}

                  {cust.isBlocked && cust.blockReason && (
                    <div className="text-[11px] text-rose-600 font-medium">
                      Suspension reason: {cust.blockReason}
                    </div>
                  )}
                </div>

                {/* Middle: Garage Vehicles */}
                <div className="flex-1 bg-slate-50/70 p-3 rounded-lg border border-slate-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-500" />
                      <span>Garage ({cust.vehicles.length})</span>
                    </span>
                    <button
                      onClick={() => setShowAddVehicleModal(cust.id)}
                      className="text-[11px] font-bold text-slate-900 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Car</span>
                    </button>
                  </div>

                  {cust.vehicles.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No vehicles registered yet</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cust.vehicles.map((v) => (
                        <div
                          key={v.id}
                          className="bg-white px-2.5 py-1.5 rounded-md border border-slate-200 text-xs flex items-center gap-2 shadow-2xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-800">
                              {v.brand} {v.model}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {v.plate} • {v.transmission}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 pl-1 border-l border-slate-100">
                            <button
                              onClick={() => setEditingVehicle({ customerId: cust.id, vehicle: v })}
                              className="p-1 text-slate-400 hover:text-slate-700 transition"
                              title="Edit Vehicle"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeletingVehicle({ customerId: cust.id, vehicleId: v.id, vehicleName: `${v.brand} ${v.model} (${v.plate})` })}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingCustomer(cust)}
                      className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (cust.verificationStatus === "VERIFIED") {
                          rejectCustomerVerification(cust.id, "Admin verification reset");
                          notify(`Verification reset for ${cust.fullName}`);
                        } else {
                          verifyCustomerData(cust.id);
                          notify(`Customer ${cust.fullName} verified successfully.`);
                        }
                        refresh();
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition ${
                        cust.verificationStatus === "VERIFIED"
                          ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {cust.verificationStatus === "VERIFIED" ? "Revoke KYC" : "Verify Data"}
                    </button>

                    <button
                      onClick={() => setBlockingCustomer(cust)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition ${
                        cust.isBlocked
                          ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                          : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      {cust.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => setDeletingCustomer(cust)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSetSimulatorCustomer(cust)}
                    className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium mt-1"
                  >
                    <Smartphone className="w-3 h-3 text-slate-400" />
                    <span>Set in Simulator</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: ADD NEW CUSTOMER */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 98450 12345"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Permanent 4-Digit Sathi PIN Field */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Permanent 4-Digit Sathi PIN *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPin(generateUniqueCustomerPin())}
                    className="text-[10px] text-blue-700 font-bold hover:underline"
                  >
                    Generate Another PIN
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="e.g. 4892"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full p-2 rounded-lg border border-blue-300 bg-white text-blue-900 font-mono tracking-widest font-black text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500">
                  Unique ride-start code assigned permanently to this customer for all chauffeur handovers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City / District</label>
                  <input
                    type="text"
                    placeholder="Vidisha / Bhopal"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, Colony, Landmark"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* Initial Car */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-xs">Initial Vehicle in Garage (Optional)</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Brand (e.g. Hyundai, Toyota)"
                    value={initialCarBrand}
                    onChange={(e) => setInitialCarBrand(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Model (e.g. Creta, Fortuner)"
                    value={initialCarModel}
                    onChange={(e) => setInitialCarModel(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Plate (e.g. MP-04-AB-1234)"
                    value={initialCarPlate}
                    onChange={(e) => setInitialCarPlate(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                  <select
                    value={initialCarTrans}
                    onChange={(e) => setInitialCarTrans(e.target.value as any)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                    <option value="LUXURY">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CUSTOMER PROFILE */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Edit Customer Profile</h3>
              <button onClick={() => setEditingCustomer(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={editingCustomer.fullName}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, fullName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Permanent Sathi PIN in Edit Modal */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Permanent 4-Digit Sathi PIN</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingCustomer({
                        ...editingCustomer,
                        permanentPin: generateUniqueCustomerPin(),
                      })
                    }
                    className="text-[10px] text-blue-700 font-bold hover:underline"
                  >
                    Generate New PIN
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={editingCustomer.permanentPin || ""}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, permanentPin: e.target.value })
                  }
                  className="w-full p-2 rounded-lg border border-blue-300 bg-white text-blue-900 font-mono tracking-widest font-black text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={editingCustomer.city}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Emergency Phone</label>
                  <input
                    type="text"
                    value={editingCustomer.emergencyPhone || ""}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, emergencyPhone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Address</label>
                <input
                  type="text"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD VEHICLE TO GARAGE */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add Vehicle to Garage</h3>
              <button onClick={() => setShowAddVehicleModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {vehicleError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{vehicleError}</span>
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMW"
                    value={vehBrand}
                    onChange={(e) => setVehBrand(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 330Li"
                    value={vehModel}
                    onChange={(e) => setVehModel(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">License Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="MP-04-BK-8822"
                    value={vehPlate}
                    onChange={(e) => setVehPlate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Transmission</label>
                  <select
                    value={vehTrans}
                    onChange={(e) => setVehTrans(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                    <option value="LUXURY">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Grey"
                    value={vehColor}
                    onChange={(e) => setVehColor(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Year</label>
                  <input
                    type="number"
                    value={vehYear}
                    onChange={(e) => setVehYear(parseInt(e.target.value) || 2024)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT VEHICLE */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Edit Vehicle</h3>
              <button onClick={() => setEditingVehicle(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateVehicle} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Brand</label>
                  <input
                    type="text"
                    value={editingVehicle.vehicle.brand}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        vehicle: { ...editingVehicle.vehicle, brand: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Model</label>
                  <input
                    type="text"
                    value={editingVehicle.vehicle.model}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        vehicle: { ...editingVehicle.vehicle, model: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">License Plate</label>
                  <input
                    type="text"
                    value={editingVehicle.vehicle.plate}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        vehicle: { ...editingVehicle.vehicle, plate: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Transmission</label>
                  <select
                    value={editingVehicle.vehicle.transmission}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        vehicle: { ...editingVehicle.vehicle, transmission: e.target.value as any },
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                    <option value="LUXURY">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: BLOCK / UNBLOCK MODAL */}
      {blockingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${blockingCustomer.isBlocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {blockingCustomer.isBlocked ? "Unblock Customer Account" : "Suspend Customer Account"}
                </h3>
                <p className="text-xs text-slate-500">{blockingCustomer.fullName} ({blockingCustomer.phone})</p>
              </div>
            </div>

            {!blockingCustomer.isBlocked && (
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700">Reason for Suspension</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Customer requested temporary freeze">Customer requested temporary freeze</option>
                  <option value="Payment / terms discrepancy under review">Payment / terms discrepancy under review</option>
                  <option value="Disciplinary policy violation">Disciplinary policy violation</option>
                  <option value="Fraudulent activity detected">Fraudulent activity detected</option>
                </select>
              </div>
            )}

            <p className="text-xs text-slate-600">
              {blockingCustomer.isBlocked
                ? "Unblocking will immediately restore this customer's ability to book verified chauffeurs in all operating regions."
                : "Suspending will block this customer from initiating any new chauffeur dispatches across the platform."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBlockingCustomer(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleBlock}
                className={`px-4 py-2 rounded-lg font-bold text-xs ${
                  blockingCustomer.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                }`}
              >
                {blockingCustomer.isBlocked ? "Confirm Unblock" : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: DELETE CUSTOMER */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Delete Customer?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete <b>{deletingCustomer.fullName}</b>? All garage vehicles and history will be removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setDeletingCustomer(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-3.5 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: DELETE VEHICLE CONFIRMATION */}
      {deletingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Remove Vehicle?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <b>{deletingVehicle.vehicleName}</b> from this customer's garage?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setDeletingVehicle(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteVehicle}
                className="px-3.5 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Remove Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
