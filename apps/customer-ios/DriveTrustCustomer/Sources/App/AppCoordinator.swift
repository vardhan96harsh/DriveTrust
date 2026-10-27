import SwiftUI

enum AppNavState {
    case login
    case register
    case mainTabs
    case tracking
    case handoverAudit
    case rating
    case safetyCenter
}

struct AppCoordinator: View {
    @State private var navState: AppNavState = .login
    @State private var activeTab: HomeTab = .book

    @State private var customerName: String = "Harshvardhan"
    @State private var customerPhone: String = "+91 98450 12345"

    @State private var vehicles: [CustomerVehicle] = [
        CustomerVehicle(brand: "Toyota", model: "Fortuner 4x4", plate: "MP-40-CA-4921", transmission: "AUTOMATIC", color: "Pearl White", year: 2023),
        CustomerVehicle(brand: "BMW", model: "330Li M Sport", plate: "MP-04-BK-8822", transmission: "LUXURY", color: "Mineral Grey", year: 2024)
    ]
    @State private var selectedVehicleId: String = ""

    @State private var currentBooking: TripBooking = TripBooking()

    init() {
        _selectedVehicleId = State(initialValue: "veh-01")
    }

    var activeVehicle: CustomerVehicle? {
        vehicles.first(where: { $0.id == selectedVehicleId }) ?? vehicles.first
    }

    var body: some View {
        Group {
            switch navState {
            case .login:
                LoginView(
                    onLoginSuccess: { phone in
                        customerPhone = phone
                        navState = .mainTabs
                    },
                    onGoToRegister: {
                        navState = .register
                    }
                )

            case .register:
                RegisterView(
                    onRegisterSuccess: { name, phone, car in
                        customerName = name
                        customerPhone = phone
                        vehicles.append(car)
                        selectedVehicleId = car.id
                        navState = .mainTabs
                    },
                    onBackToLogin: {
                        navState = .login
                    }
                )

            case .mainTabs:
                ZStack(alignment: .bottom) {
                    Group {
                        switch activeTab {
                        case .book:
                            BookingView(
                                customerName: customerName,
                                carModel: activeVehicle != nil ? "\(activeVehicle!.brand) \(activeVehicle!.model)" : "Toyota Fortuner 4x4",
                                carPlate: activeVehicle?.plate ?? "MP-40-CA-4921",
                                preferredDriverName: nil,
                                onBookChauffeur: { service, pickup, dropoff, fare in
                                    currentBooking = TripBooking(
                                        serviceType: service,
                                        pickupAddress: pickup,
                                        destinationAddress: dropoff,
                                        vehicleModel: activeVehicle != nil ? "\(activeVehicle!.brand) \(activeVehicle!.model)" : "Toyota Fortuner",
                                        vehiclePlate: activeVehicle?.plate ?? "MP-40-CA-4921",
                                        startOtp: "8492",
                                        estimatedFare: fare,
                                        assignedDriverName: "Rajesh Sharma",
                                        assignedDriverDL: "MP4020190012345",
                                        isDriverVerifiedByAdmin: true,
                                        status: "ACCEPTED"
                                    )
                                    navState = .tracking
                                },
                                onOpenSafety: { navState = .safetyCenter },
                                onOpenNotifications: {},
                                onOpenSupport: {},
                                onLogout: { navState = .login }
                            )

                        case .garage:
                            MyGarageView(
                                vehicles: $vehicles,
                                selectedVehicleId: $selectedVehicleId,
                                onAddVehicle: { v in vehicles.append(v) },
                                onDeleteVehicle: { id in
                                    vehicles.removeAll(where: { $0.id == id })
                                }
                            )

                        case .wallet:
                            WalletView()

                        case .history:
                            RideHistoryView()

                        case .profile:
                            ProfileView(
                                customerName: customerName,
                                onOpenSafety: { navState = .safetyCenter },
                                onOpenSupport: {},
                                onLogout: { navState = .login }
                            )
                        }
                    }

                    // Persistent 5-Tab Navigation Bar
                    CustomBottomNavBar(activeTab: $activeTab)
                }

            case .tracking:
                CustomerRideTrackingView()
                    .overlay(
                        VStack {
                            HStack {
                                Button(action: { navState = .handoverAudit }) {
                                    HStack(spacing: 4) {
                                        Image(systemName: "list.clipboard.fill")
                                        Text("Handover Audit")
                                            .font(.system(size: 11, weight: .bold))
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(Color.gold500)
                                    .foregroundColor(.midnightDark)
                                    .cornerRadius(8)
                                }

                                Spacer()

                                Button(action: { navState = .rating }) {
                                    Text("End Trip")
                                        .font(.system(size: 11, weight: .bold))
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 6)
                                        .background(Color.emerald600)
                                        .foregroundColor(.white)
                                        .cornerRadius(8)
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.top, 50)
                            Spacer()
                        }
                    )

            case .handoverAudit:
                HandoverAuditView(
                    carModel: currentBooking.vehicleModel,
                    carPlate: currentBooking.vehiclePlate,
                    driverName: currentBooking.assignedDriverName,
                    onConfirmHandover: { navState = .tracking },
                    onBack: { navState = .tracking }
                )

            case .rating:
                RatingView(
                    booking: currentBooking,
                    onBookAnotherRide: { navState = .mainTabs }
                )

            case .safetyCenter:
                SafetyCenterView(onBack: { navState = .mainTabs })
            }
        }
    }
}
