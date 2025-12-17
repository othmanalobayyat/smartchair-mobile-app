// screens/SmartChairScreens/ChairGraphic.js
import React from "react";
import { Animated } from "react-native";
import Svg, { Path, Rect, G, Circle } from "react-native-svg";

export default function ChairGraphic({
  pressures,
  monitoring,
  scaleAnim,
  theme,
  getColor,
}) {
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width={280} height={280} viewBox="0 0 511.992 511.992">
        {/* Chair legs & supports */}
        <G>
          <Rect
            x="394.647"
            y="234.656"
            width="21.344"
            height="78.22"
            fill={theme.muted}
          />
          <Rect
            x="95.997"
            y="234.656"
            width="21.328"
            height="78.22"
            fill={theme.muted}
          />
          <Path
            d="M149.327 499.992v-52c0-1.312 1.922-3.594 3.219-3.812l85.913-14.312c4.406-.734 10.797-1.156 17.539-1.156 6.734 0 13.125.422 17.531 1.156l85.92 14.312c1.281.219 3.203 2.5 3.203 3.812v52h21.344v-52c0-11.734-9.469-22.922-21.047-24.842l-85.904-14.328c-5.797-.953-13.422-1.438-21.046-1.438-7.633 0-15.258.484-21.047 1.438l-85.913 14.328C137.469 425.07 128 436.257 128 447.992v52h21.327z"
            fill={theme.muted}
          />
        </G>

        {/* Chair column */}
        <Rect
          x="245.327"
          y="353.996"
          width="21.335"
          height="133.54"
          fill={theme.border}
        />

        {/* Chair back */}
        <Path
          d="M383.995 351.994c0 5.875-4.781 10.656-10.672 10.656h-234.66c-5.891 0-10.664-4.781-10.664-10.656V10.656C127.998 4.765 132.771 0 138.663 0h234.66c5.891 0 10.672 4.765 10.672 10.656V351.994z"
          fill={theme.surface}
        />

        {/* Seat base */}
        <Path
          d="M415.995 361.994c0 5.875-4.781 10.656-10.672 10.656H106.664c-5.891 0-10.664-4.781-10.664-10.656v-73.342c0-5.891 4.773-10.656 10.664-10.656h298.659c5.891 0 10.672 4.766 10.672 10.656V361.994z"
          fill={theme.chairBase}
        />

        {/* Sensors */}
        <Circle cx="150" cy="300" r="16" fill={getColor(pressures[0])} />
        <Circle cx="360" cy="300" r="16" fill={getColor(pressures[1])} />
        <Circle cx="150" cy="355" r="16" fill={getColor(pressures[2])} />
        <Circle cx="360" cy="355" r="16" fill={getColor(pressures[3])} />
        <Circle cx="190" cy="220" r="16" fill={getColor(pressures[4])} />
        <Circle cx="320" cy="220" r="16" fill={getColor(pressures[5])} />
      </Svg>
    </Animated.View>
  );
}
