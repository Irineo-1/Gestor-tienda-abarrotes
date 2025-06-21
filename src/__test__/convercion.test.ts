import { kilosToGramos, GramosToKilos } from '../utils/convercion';

describe('Convercion de unidades de medida', () => {
  test('Convierte de kilos a gramos', () => {
    expect(kilosToGramos(1)).toBe(1000);
    expect(kilosToGramos(1.5)).toBe(1500);
    expect(kilosToGramos(0)).toBe(0);
  });

  test('Convierte de gramos a kilos', () => {
    expect(GramosToKilos(1000)).toBe('1');
    expect(GramosToKilos(1500)).toBe('1.5');
    expect(GramosToKilos(0)).toBe('0');
  });
});
