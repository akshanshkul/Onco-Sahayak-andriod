import React, { useEffect, useRef } from "react";
import { Animated, Modal, View } from "react-native";
import { LogoMark } from "./Logo";

export default function RegistrationLoader({ visible }: { visible: boolean }) {
  const pulse = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    if (!visible) {
      pulse.stopAnimation();
      opacity.stopAnimation();
      return;
    }

    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.75,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [opacity, pulse, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(15, 44, 82, 0.35)",
        }}
      >
        <Animated.View style={{ transform: [{ scale: pulse }], opacity }}>
          <LogoMark size={88} />
        </Animated.View>
      </View>
    </Modal>
  );
}
