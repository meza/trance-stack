import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChangeLanguage } from './useChangeLanguage';
vi.mock('react');
vi.mock('react-i18next');

describe('useChangeLanguage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should set the correct dependencies for the useEffect', () => {
    const changeLanguageMock = vi.fn();
    const i18nMock = { changeLanguage: changeLanguageMock };
    // @ts-ignore - there's something funky going on here with intellij/typescript
    vi.mocked(useTranslation).mockReturnValue({ i18n: i18nMock } as never);
    useChangeLanguage('en');
    const useEffectCalls = vi.mocked(useEffect).mock.calls[0];
    expect(useEffectCalls[0]).toBeTypeOf('function');
    expect(useEffectCalls[1]).toEqual(['en', i18nMock]);
  });

  it('should set the correct functionality', () => {
    const changeLanguageMock = vi.fn();
    const i18nMock = { changeLanguage: changeLanguageMock };
    vi.mocked(useTranslation).mockReturnValue({ i18n: i18nMock } as never);
    useChangeLanguage('es');
    const useEffectFunction = vi.mocked(useEffect).mock.calls[0][0];
    useEffectFunction();

    expect(changeLanguageMock).toHaveBeenCalledWith('es');
  });
});
