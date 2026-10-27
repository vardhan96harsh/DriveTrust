import SwiftUI

struct MyGarageView: View {
    @Binding var vehicles: [CustomerVehicle]
    @Binding var selectedVehicleId: String
    var onAddVehicle: (CustomerVehicle) -> Void
    var onDeleteVehicle: (String) -> Void

    @State private var showAddModal: Bool = false
    @State private var newBrand: String = "Mercedes-Benz"
    @State private var newModel: String = "E-Class LWB"
    @State private var newPlate: String = "MP-04-MB-2024"
    @State private var newTransmission: String = "AUTOMATIC"

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            VStack(spacing: 0) {
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("My Vehicle Garage")
                            .font(.system(size: 20, weight: .black))
                            .foregroundColor(.white)
                        Text("Select active car for chauffeur dispatch")
                            .font(.system(size: 11))
                            .foregroundColor(.slate400)
                    }
                    Spacer()

                    Button(action: { showAddModal = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "plus")
                            Text("Add Car")
                                .font(.system(size: 12, weight: .bold))
                        }
                        .foregroundColor(.midnightDark)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.gold500)
                        .cornerRadius(10)
                    }
                }
                .padding(16)
                .background(Color.midnightCard)

                ScrollView {
                    VStack(spacing: 12) {
                        ForEach(vehicles) { vehicle in
                            let isSelected = selectedVehicleId == vehicle.id
                            HStack(spacing: 14) {
                                ZStack {
                                    Circle()
                                        .fill(isSelected ? Color.gold500.opacity(0.15) : Color.midnightBorder.opacity(0.3))
                                        .frame(width: 44, height: 44)
                                    Image(systemName: "car.side.fill")
                                        .foregroundColor(isSelected ? .gold500 : .slate400)
                                }

                                VStack(alignment: .leading, spacing: 3) {
                                    Text("\(vehicle.brand) \(vehicle.model)")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(isSelected ? .white : .slate200)

                                    HStack(spacing: 6) {
                                        Text(vehicle.plate)
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(.emerald400)
                                        Text("•")
                                            .foregroundColor(.slate500)
                                        Text(vehicle.transmission)
                                            .font(.system(size: 10))
                                            .foregroundColor(.slate400)
                                    }
                                }

                                Spacer()

                                if isSelected {
                                    Text("Active")
                                        .font(.system(size: 10, weight: .black))
                                        .foregroundColor(.gold500)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.midnightDark)
                                        .cornerRadius(6)
                                        .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.gold500.opacity(0.4), lineWidth: 1))
                                } else {
                                    Button("Select") {
                                        selectedVehicleId = vehicle.id
                                    }
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(.slate300)
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(Color.midnightDark)
                                    .cornerRadius(6)
                                }

                                Button(action: { onDeleteVehicle(vehicle.id) }) {
                                    Image(systemName: "trash")
                                        .font(.system(size: 12))
                                        .foregroundColor(.red.opacity(0.8))
                                }
                            }
                            .padding(16)
                            .background(Color.midnightCard)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(isSelected ? Color.gold500.opacity(0.5) : Color.midnightBorder, lineWidth: 1.5)
                            )
                        }
                    }
                    .padding(16)
                    .padding(.bottom, 80)
                }
            }
        }
        .sheet(isPresented: $showAddModal) {
            ZStack {
                Color.midnightCard.edgesIgnoringSafeArea(.all)

                VStack(alignment: .leading, spacing: 14) {
                    Text("Add New Vehicle")
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(.white)

                    VStack(alignment: .leading, spacing: 4) {
                        Text("BRAND").font(.system(size: 9, weight: .bold)).foregroundColor(.slate400)
                        TextField("Brand", text: $newBrand)
                            .foregroundColor(.white)
                            .padding(10)
                            .background(Color.midnightDark)
                            .cornerRadius(8)
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text("MODEL").font(.system(size: 9, weight: .bold)).foregroundColor(.slate400)
                        TextField("Model", text: $newModel)
                            .foregroundColor(.white)
                            .padding(10)
                            .background(Color.midnightDark)
                            .cornerRadius(8)
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text("LICENSE PLATE").font(.system(size: 9, weight: .bold)).foregroundColor(.slate400)
                        TextField("Plate", text: $newPlate)
                            .foregroundColor(.white)
                            .padding(10)
                            .background(Color.midnightDark)
                            .cornerRadius(8)
                    }

                    Button(action: {
                        let newCar = CustomerVehicle(
                            brand: newBrand,
                            model: newModel,
                            plate: newPlate,
                            transmission: newTransmission,
                            color: "Obsidian Black",
                            year: 2024
                        )
                        onAddVehicle(newCar)
                        showAddModal = false
                    }) {
                        Text("Save Vehicle to Garage")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.midnightDark)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.gold500)
                            .cornerRadius(10)
                    }
                }
                .padding(24)
            }
        }
    }
}
