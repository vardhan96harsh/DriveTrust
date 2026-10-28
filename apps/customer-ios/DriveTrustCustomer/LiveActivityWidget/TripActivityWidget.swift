import ActivityKit
import WidgetKit
import SwiftUI

@available(iOS 16.1, *)
struct DriveTrustWidgets: WidgetBundle {
    var body: some Widget {
        TripLiveActivityWidget()
    }
}

@available(iOS 16.1, *)
struct TripLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TripActivityAttributes.self) { context in
            // Lock Screen Live Activity Banner View
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 8, height: 8)
                        Text(context.attributes.serviceType.uppercased())
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.green)
                    }
                    Spacer()
                    Text("START OTP: \(context.state.startOTP)")
                        .font(.system(size: 13, weight: .black, design: .monospaced))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.green.opacity(0.15))
                        .cornerRadius(6)
                        .foregroundColor(.green)
                }

                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(context.state.driverName)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                        Text(context.state.statusText)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(.gray)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(timerInterval: safeTimerInterval(until: context.state.estimatedArrival), countsDown: true)
                            .font(.system(size: 18, weight: .black, design: .rounded))
                            .foregroundColor(.white)
                        Text(String(format: "%.1f km away", context.state.distanceKm))
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(16)
            .background(Color(red: 0.07, green: 0.09, blue: 0.15))
        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI
                DynamicIslandExpandedRegion(.leading) {
                    HStack(spacing: 4) {
                        Image(systemName: "car.fill")
                            .foregroundColor(.green)
                        Text(context.state.driverName)
                            .font(.system(size: 14, weight: .bold))
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(timerInterval: safeTimerInterval(until: context.state.estimatedArrival), countsDown: true)
                        .font(.system(size: 15, weight: .black, design: .rounded))
                        .foregroundColor(.green)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    HStack {
                        Text(context.state.statusText)
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                        Spacer()
                        Text("OTP: \(context.state.startOTP)")
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.green.opacity(0.2))
                            .cornerRadius(4)
                            .foregroundColor(.green)
                    }
                }
            } compactLeading: {
                Image(systemName: "car.fill")
                    .foregroundColor(.green)
            } compactTrailing: {
                Text(timerInterval: safeTimerInterval(until: context.state.estimatedArrival), countsDown: true)
                    .font(.system(size: 12, weight: .bold, design: .rounded))
                    .foregroundColor(.green)
            } minimal: {
                Image(systemName: "car.fill")
                    .foregroundColor(.green)
            }
        }
    }

    private func safeTimerInterval(until date: Date) -> ClosedRange<Date> {
        let now = Date()
        return now...max(now, date)
    }
}
