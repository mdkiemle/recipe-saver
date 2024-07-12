import { useEffect } from "react";

export const useMount = (effect: React.EffectCallback) => useEffect(effect, []);
