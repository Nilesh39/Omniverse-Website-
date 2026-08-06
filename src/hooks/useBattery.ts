import { useState, useEffect } from 'react';

export interface BatteryState {
  supported: boolean;
  level: number; // 0 to 1
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

export function useBattery(): BatteryState {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    supported: false,
    level: 1,
    charging: true,
    chargingTime: 0,
    dischargingTime: Infinity,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    let batteryObj: any = null;
    let updateBatteryFn: (() => void) | null = null;

    if (nav.getBattery) {
      nav.getBattery().then((battery: any) => {
        batteryObj = battery;
        const updateBattery = () => {
          setBatteryState({
            supported: true,
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          });
        };
        updateBatteryFn = updateBattery;

        updateBattery();

        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        setBatteryState(prev => ({ ...prev, supported: false }));
      });
    }

    return () => {
      if (batteryObj && updateBatteryFn) {
        batteryObj.removeEventListener('levelchange', updateBatteryFn);
        batteryObj.removeEventListener('chargingchange', updateBatteryFn);
      }
    };
  }, []);

  return batteryState;
}
