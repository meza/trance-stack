import { JSDOM } from 'jsdom';
import { beforeEach, describe, it, vi } from 'vitest';
import { sensorScript, updateScript } from '~/components/ColorModeSwitcher/clientUtils';
import type { MockedFunction } from 'vitest';

interface SensorTestContext {
  dom: JSDOM;
  htmlElement: Element | null;
  matchMediaMock: MockedFunction<typeof window.matchMedia>
}

describe('The color switcher client utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('the sensor script', () => {
    beforeEach<SensorTestContext>((context) => {
      context.dom = new JSDOM();
      context.htmlElement = context.dom.window.document.firstElementChild;
      vi.stubGlobal('document', context.dom.window.document);

      context.matchMediaMock = vi.fn();
      vi.stubGlobal('window', { matchMedia: context.matchMediaMock });
    });

    describe('when the body has no dark or light class', () => {
      describe('and the user prefers dark mode', () => {
        it<SensorTestContext>('adds the dark class', (context) => {
          context.matchMediaMock.mockReturnValue({ matches: true } as never);
          sensorScript();
          expect(context.htmlElement?.classList.contains('dark')).toBe(true);
          expect(context.matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
        });
      });

      describe('and the user prefers light mode', () => {
        it<SensorTestContext>('adds the light class', (context) => {
          context.matchMediaMock.mockReturnValue({ matches: false } as never);
          sensorScript();
          expect(context.htmlElement?.classList.contains('light')).toBe(true);
          expect(context.matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
        });
      });
    });

    describe('when the body has a predefined light class', () => {
      beforeEach<SensorTestContext>((context) => {
        context.htmlElement?.classList.add('light');
      });

      describe('and the user prefers dark mode', () => {
        it<SensorTestContext>('does not change to dark', (context) => {
          sensorScript();
          expect(context.htmlElement?.classList.contains('dark')).not.toBe(true);
          expect(context.matchMediaMock).not.toHaveBeenCalled();
        });
      });

      describe('and the user prefers light mode', () => {
        it<SensorTestContext>('does not change the dom unnecessarily', (context) => {
          sensorScript();
          expect(context.htmlElement?.classList.contains('light')).toBe(true);
          expect(context.matchMediaMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the body has a predefined dark class', () => {
      beforeEach<SensorTestContext>((context) => {
        context.htmlElement?.classList.add('dark');
      });

      describe('and the user prefers light mode', () => {
        it<SensorTestContext>('does not change to light', (context) => {
          sensorScript();
          expect(context.htmlElement?.classList.contains('light')).not.toBe(true);
          expect(context.matchMediaMock).not.toHaveBeenCalled();
        });
      });

      describe('and the user prefers dark mode', () => {
        it<SensorTestContext>('does not change the dom unnecessarily', (context) => {
          sensorScript();
          expect(context.htmlElement?.classList.contains('dark')).toBe(true);
          expect(context.matchMediaMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('the update script', () => {
    beforeEach<SensorTestContext>((context) => {
      context.dom = new JSDOM();
      context.htmlElement = context.dom.window.document.firstElementChild;
      vi.stubGlobal('document', context.dom.window.document);

      context.matchMediaMock = vi.fn();
      vi.stubGlobal('window', { matchMedia: context.matchMediaMock });
    });

    it<SensorTestContext>('adds a listener to the load event', (context) => {
      const addWindowEventListenerMock = vi.fn();
      vi.stubGlobal('addEventListener', addWindowEventListenerMock);
      updateScript();
      expect(addWindowEventListenerMock).toHaveBeenCalledWith('load', expect.any(Function));
    });

    describe('when the load event fires', () => {
      it<SensorTestContext>('adds a listener to the color scheme change event', (context) => {
        const addWindowEventListenerMock = vi.fn();
        vi.stubGlobal('addEventListener', addWindowEventListenerMock);

        const addMatchMediaEventListenerMock = vi.fn();
        context.matchMediaMock.mockReturnValue({ addEventListener: addMatchMediaEventListenerMock } as never);
        updateScript();
        const loadListener = addWindowEventListenerMock.mock.calls[0][1];
        loadListener();
        expect(addMatchMediaEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
      });

      describe('when the color scheme changes from dark to light', () => {
        it<SensorTestContext>('removes the old class dark and adds the new light class', (context) => {
          const addWindowEventListenerMock = vi.fn();
          vi.stubGlobal('addEventListener', addWindowEventListenerMock);

          const addMatchMediaEventListenerMock = vi.fn();
          context.matchMediaMock.mockReturnValue({ addEventListener: addMatchMediaEventListenerMock } as never);
          updateScript();
          const loadListener = addWindowEventListenerMock.mock.calls[0][1];
          loadListener();

          const changeListener = addMatchMediaEventListenerMock.mock.calls[0][1];
          context.htmlElement?.classList.add('dark');
          changeListener({ matches: false } as never);
          expect(context.htmlElement?.classList.contains('dark')).toBe(false);
          expect(context.htmlElement?.classList.contains('light')).toBe(true);
        });
      });

      describe('when the color scheme changes from light to dark', () => {
        it<SensorTestContext>('removes the old class light and adds the new dark class', (context) => {
          const addWindowEventListenerMock = vi.fn();
          vi.stubGlobal('addEventListener', addWindowEventListenerMock);

          const addMatchMediaEventListenerMock = vi.fn();
          context.matchMediaMock.mockReturnValue({ addEventListener: addMatchMediaEventListenerMock } as never);
          updateScript();
          const loadListener = addWindowEventListenerMock.mock.calls[0][1];
          loadListener();

          const changeListener = addMatchMediaEventListenerMock.mock.calls[0][1];
          context.htmlElement?.classList.add('light');
          changeListener({ matches: true } as never);
          expect(context.htmlElement?.classList.contains('light')).toBe(false);
          expect(context.htmlElement?.classList.contains('dark')).toBe(true);
        });
      });
    });

  });
});
