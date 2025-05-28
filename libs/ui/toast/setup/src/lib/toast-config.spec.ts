import { TestBed } from '@angular/core/testing';
import { 
  ToastConfig, 
  ToastAnimationConfig, 
  ToastPositionConfig, 
  TOAST_CONFIG_TOKEN 
} from './toast-config';
import { ToastSetupConstants } from './setup-constants';

describe('ToastConfig', () => {
  
  describe('ToastConfig', () => {
    describe('factory creation', () => {
      it('should create instance using Create factory method with default values', () => {
        const config = ToastConfig.Create();
        
        expect(config).toBeInstanceOf(ToastConfig);
        expect(config.colorBgError).toBe(ToastSetupConstants.ColorBgError);
        expect(config.colorBgWarn).toBe(ToastSetupConstants.ColorBgWarn);
        expect(config.colorBgSuccess).toBe(ToastSetupConstants.ColorBgSuccess);
        expect(config.colorBgInfo).toBe(ToastSetupConstants.ColorBgInfo);
        expect(config.colorBgDefault).toBe(ToastSetupConstants.ColorBgDefault);
        expect(config.colorText).toBe(ToastSetupConstants.ColorText);
        expect(config.positionConfig).toBeInstanceOf(ToastPositionConfig);
        expect(config.animationConfig).toBeInstanceOf(ToastAnimationConfig);
      });

      it('should create instance with custom color values', () => {
        const customColors = {
          colorBgError: '#custom-error',
          colorBgWarn: '#custom-warn',
          colorBgSuccess: '#custom-success',
          colorBgInfo: '#custom-info',
          colorBgDefault: '#custom-default',
          colorText: '#custom-text'
        };

        const config = ToastConfig.Create(
          customColors.colorBgError,
          customColors.colorBgWarn,
          customColors.colorBgSuccess,
          customColors.colorBgInfo,
          customColors.colorBgDefault,
          customColors.colorText
        );

        expect(config.colorBgError).toBe(customColors.colorBgError);
        expect(config.colorBgWarn).toBe(customColors.colorBgWarn);
        expect(config.colorBgSuccess).toBe(customColors.colorBgSuccess);
        expect(config.colorBgInfo).toBe(customColors.colorBgInfo);
        expect(config.colorBgDefault).toBe(customColors.colorBgDefault);
        expect(config.colorText).toBe(customColors.colorText);
      });

      it('should create instance with custom position and animation configs', () => {
        const customPosition = ToastPositionConfig.Create(10, 15, 25, 30);
        const customAnimation = ToastAnimationConfig.Create(1000, 750);

        const config = ToastConfig.Create(
          undefined, undefined, undefined, undefined, undefined, undefined,
          customPosition,
          customAnimation
        );

        expect(config.positionConfig).toBe(customPosition);
        expect(config.animationConfig).toBe(customAnimation);
      });
    });

    describe('text color getters', () => {
      it('should return default text color when not customized', () => {
        const config = ToastConfig.Create();
        
        expect(config.colorTxtError).toBe(ToastSetupConstants.ColorText);
        expect(config.colorTxtWarn).toBe(ToastSetupConstants.ColorText);
        expect(config.colorTxtSuccess).toBe(ToastSetupConstants.ColorText);
        expect(config.colorTxtInfo).toBe(ToastSetupConstants.ColorText);
      });

      it('should handle null assignment correctly in text color getters', () => {
        const config = ToastConfig.Create();
        
        // Access getters to trigger the null coalescing assignment
        const errorColor = config.colorTxtError;
        const warnColor = config.colorTxtWarn;
        const successColor = config.colorTxtSuccess;
        const infoColor = config.colorTxtInfo;
        
        expect(errorColor).toBe(ToastSetupConstants.ColorText);
        expect(warnColor).toBe(ToastSetupConstants.ColorText);
        expect(successColor).toBe(ToastSetupConstants.ColorText);
        expect(infoColor).toBe(ToastSetupConstants.ColorText);
      });
    });

    describe('setter methods', () => {
      let config: ToastConfig;

      beforeEach(() => {
        config = ToastConfig.Create();
      });

      describe('background color setters', () => {
        it('should set error background color and return instance for chaining', () => {
          const newColor = '#ff0000';
          const result = config.setColorBgError(newColor);
          
          expect(config.colorBgError).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set warning background color and return instance for chaining', () => {
          const newColor = '#ffaa00';
          const result = config.setColorBgWarn(newColor);
          
          expect(config.colorBgWarn).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set success background color and return instance for chaining', () => {
          const newColor = '#00ff00';
          const result = config.setColorBgSuccess(newColor);
          
          expect(config.colorBgSuccess).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set info background color and return instance for chaining', () => {
          const newColor = '#0088ff';
          const result = config.setColorBgInfo(newColor);
          
          expect(config.colorBgInfo).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set default background color and return instance for chaining', () => {
          const newColor = '#f0f0f0';
          const result = config.setColorBgDefault(newColor);
          
          expect(config.colorBgDefault).toBe(newColor);
          expect(result).toBe(config);
        });
      });

      describe('text color setters', () => {
        it('should set error text color and return instance for chaining', () => {
          const newColor = '#990000';
          const result = config.setColorTxtError(newColor);
          
          expect(config.colorTxtError).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set warning text color and return instance for chaining', () => {
          const newColor = '#996600';
          const result = config.setColorTxtWarn(newColor);
          
          expect(config.colorTxtWarn).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set success text color and return instance for chaining', () => {
          const newColor = '#006600';
          const result = config.setColorTxtSuccess(newColor);
          
          expect(config.colorTxtSuccess).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set info text color and return instance for chaining', () => {
          const newColor = '#004499';
          const result = config.setColorTxtInfo(newColor);
          
          expect(config.colorTxtInfo).toBe(newColor);
          expect(result).toBe(config);
        });

        it('should set general text color and return instance for chaining', () => {
          const newColor = '#333333';
          const result = config.setColorText(newColor);
          
          expect(config.colorText).toBe(newColor);
          expect(result).toBe(config);
        });
      });

      describe('config object setters', () => {
        it('should set position config and return instance for chaining', () => {
          const newPositionConfig = ToastPositionConfig.Create(50, 60, 70, 80);
          const result = config.setPositionConfig(newPositionConfig);
          
          expect(config.positionConfig).toBe(newPositionConfig);
          expect(result).toBe(config);
        });

        it('should set animation config and return instance for chaining', () => {
          const newAnimationConfig = ToastAnimationConfig.Create(2000, 1500);
          const result = config.setAnimationConfig(newAnimationConfig);
          
          expect(config.animationConfig).toBe(newAnimationConfig);
          expect(result).toBe(config);
        });
      });

      describe('method chaining', () => {
        it('should support fluent interface with method chaining', () => {
          const result = config
            .setColorBgError('#ff0000')
            .setColorBgWarn('#ffaa00')
            .setColorText('#333333')
            .setPositionConfig(ToastPositionConfig.Create(100, 100, 100, 100))
            .setAnimationConfig(ToastAnimationConfig.Create(3000, 2000));

          expect(result).toBe(config);
          expect(config.colorBgError).toBe('#ff0000');
          expect(config.colorBgWarn).toBe('#ffaa00');
          expect(config.colorText).toBe('#333333');
          expect(config.positionConfig.topPx).toBe(100);
          expect(config.animationConfig.leaveMs).toBe(3000);
        });
      });
    });

    describe('constructor behavior', () => {
      it('should use default values when constructor parameters are undefined', () => {
        const config = ToastConfig.Create(
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined
        );

        expect(config.colorBgError).toBe(ToastSetupConstants.ColorBgError);
        expect(config.colorBgWarn).toBe(ToastSetupConstants.ColorBgWarn);
        expect(config.colorBgSuccess).toBe(ToastSetupConstants.ColorBgSuccess);
        expect(config.colorBgInfo).toBe(ToastSetupConstants.ColorBgInfo);
        expect(config.colorBgDefault).toBe(ToastSetupConstants.ColorBgDefault);
        expect(config.colorText).toBe(ToastSetupConstants.ColorText);
        expect(config.positionConfig).toBeInstanceOf(ToastPositionConfig);
        expect(config.animationConfig).toBeInstanceOf(ToastAnimationConfig);
      });

      it('should only override values that are provided', () => {
        const config = ToastConfig.Create(
          '#custom-error', 
          undefined, 
          '#custom-success', 
          undefined, 
          undefined, 
          '#custom-text'
        );

        expect(config.colorBgError).toBe('#custom-error');
        expect(config.colorBgWarn).toBe(ToastSetupConstants.ColorBgWarn); // default
        expect(config.colorBgSuccess).toBe('#custom-success');
        expect(config.colorBgInfo).toBe(ToastSetupConstants.ColorBgInfo); // default
        expect(config.colorBgDefault).toBe(ToastSetupConstants.ColorBgDefault); // default
        expect(config.colorText).toBe('#custom-text');
      });
    });
  });

  describe('ToastAnimationConfig', () => {
    describe('factory creation', () => {
      it('should create instance with default animation values', () => {
        const config = ToastAnimationConfig.Create();
        
        expect(config).toBeInstanceOf(ToastAnimationConfig);
        expect(config.leaveMs).toBe(500);
        expect(config.enterMs).toBe(350);
      });

      it('should create instance with custom animation values', () => {
        const config = ToastAnimationConfig.Create(1000, 750);
        
        expect(config.leaveMs).toBe(1000);
        expect(config.enterMs).toBe(750);
      });

      it('should handle partial parameter override', () => {
        const config = ToastAnimationConfig.Create(2000);
        
        expect(config.leaveMs).toBe(2000);
        expect(config.enterMs).toBe(350); // default value
      });
    });

    describe('property access', () => {
      it('should provide public access to animation timing properties', () => {
        const config = ToastAnimationConfig.Create(1500, 1000);
        
        expect(config.leaveMs).toBe(1500);
        expect(config.enterMs).toBe(1000);
        
        // Properties should be mutable since they're public
        config.leaveMs = 2000;
        config.enterMs = 1500;
        
        expect(config.leaveMs).toBe(2000);
        expect(config.enterMs).toBe(1500);
      });
    });

    describe('edge cases', () => {
      it('should handle zero values', () => {
        const config = ToastAnimationConfig.Create(0, 0);
        
        expect(config.leaveMs).toBe(0);
        expect(config.enterMs).toBe(0);
      });

      it('should handle very large values', () => {
        const config = ToastAnimationConfig.Create(999999, 999999);
        
        expect(config.leaveMs).toBe(999999);
        expect(config.enterMs).toBe(999999);
      });
    });
  });

  describe('ToastPositionConfig', () => {
    describe('factory creation', () => {
      it('should create instance with default position values', () => {
        const config = ToastPositionConfig.Create();
        
        expect(config).toBeInstanceOf(ToastPositionConfig);
        expect(config.topPx).toBe(20);
        expect(config.rightPx).toBe(20);
        expect(config.bottomPx).toBe(20);
        expect(config.leftPx).toBe(20);
      });

      it('should create instance with custom position values', () => {
        const config = ToastPositionConfig.Create(10, 15, 25, 30);
        
        expect(config.topPx).toBe(10);
        expect(config.rightPx).toBe(15);
        expect(config.bottomPx).toBe(25);
        expect(config.leftPx).toBe(30);
      });

      it('should handle partial parameter override', () => {
        const config = ToastPositionConfig.Create(100);
        
        expect(config.topPx).toBe(100);
        expect(config.rightPx).toBe(20); // default
        expect(config.bottomPx).toBe(20); // default
        expect(config.leftPx).toBe(20); // default
      });

      it('should handle partial parameter override with multiple params', () => {
        const config = ToastPositionConfig.Create(100, 200);
        
        expect(config.topPx).toBe(100);
        expect(config.rightPx).toBe(200);
        expect(config.bottomPx).toBe(20); // default
        expect(config.leftPx).toBe(20); // default
      });
    });

    describe('property access', () => {
      it('should provide public access to position properties', () => {
        const config = ToastPositionConfig.Create(50, 60, 70, 80);
        
        expect(config.topPx).toBe(50);
        expect(config.rightPx).toBe(60);
        expect(config.bottomPx).toBe(70);
        expect(config.leftPx).toBe(80);
        
        // Properties should be mutable since they're public
        config.topPx = 100;
        config.rightPx = 110;
        config.bottomPx = 120;
        config.leftPx = 130;
        
        expect(config.topPx).toBe(100);
        expect(config.rightPx).toBe(110);
        expect(config.bottomPx).toBe(120);
        expect(config.leftPx).toBe(130);
      });
    });

    describe('edge cases', () => {
      it('should handle zero values', () => {
        const config = ToastPositionConfig.Create(0, 0, 0, 0);
        
        expect(config.topPx).toBe(0);
        expect(config.rightPx).toBe(0);
        expect(config.bottomPx).toBe(0);
        expect(config.leftPx).toBe(0);
      });

      it('should handle negative values', () => {
        const config = ToastPositionConfig.Create(-10, -20, -30, -40);
        
        expect(config.topPx).toBe(-10);
        expect(config.rightPx).toBe(-20);
        expect(config.bottomPx).toBe(-30);
        expect(config.leftPx).toBe(-40);
      });

      it('should handle very large values', () => {
        const config = ToastPositionConfig.Create(9999, 8888, 7777, 6666);
        
        expect(config.topPx).toBe(9999);
        expect(config.rightPx).toBe(8888);
        expect(config.bottomPx).toBe(7777);
        expect(config.leftPx).toBe(6666);
      });
    });
  });

  describe('TOAST_CONFIG_TOKEN', () => {
    describe('injection token', () => {
      it('should provide default ToastConfig instance through factory', () => {
        TestBed.configureTestingModule({
          providers: []
        });

        const config = TestBed.inject(TOAST_CONFIG_TOKEN);
        
        expect(config).toBeInstanceOf(ToastConfig);
        expect(config.colorBgError).toBe(ToastSetupConstants.ColorBgError);
        expect(config.colorBgWarn).toBe(ToastSetupConstants.ColorBgWarn);
        expect(config.colorBgSuccess).toBe(ToastSetupConstants.ColorBgSuccess);
        expect(config.colorBgInfo).toBe(ToastSetupConstants.ColorBgInfo);
        expect(config.colorBgDefault).toBe(ToastSetupConstants.ColorBgDefault);
        expect(config.colorText).toBe(ToastSetupConstants.ColorText);
        expect(config.positionConfig).toBeInstanceOf(ToastPositionConfig);
        expect(config.animationConfig).toBeInstanceOf(ToastAnimationConfig);
      });

      it('should allow custom ToastConfig to be provided', () => {
        const customConfig = ToastConfig.Create('#custom', '#custom', '#custom', '#custom');
        
        TestBed.configureTestingModule({
          providers: [
            { provide: TOAST_CONFIG_TOKEN, useValue: customConfig }
          ]
        });

        const config = TestBed.inject(TOAST_CONFIG_TOKEN);
        
        expect(config).toBe(customConfig);
        expect(config.colorBgError).toBe('#custom');
        expect(config.colorBgWarn).toBe('#custom');
        expect(config.colorBgSuccess).toBe('#custom');
        expect(config.colorBgInfo).toBe('#custom');
      });

      it('should create new instances when factory is called multiple times', () => {
        TestBed.configureTestingModule({
          providers: []
        });

        const config1 = TestBed.inject(TOAST_CONFIG_TOKEN);
        const config2 = TestBed.inject(TOAST_CONFIG_TOKEN);
        
        // Should be the same instance due to singleton behavior in DI
        expect(config1).toBe(config2);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should maintain configuration state across multiple setter calls', () => {
      const config = ToastConfig.Create()
        .setColorBgError('#ff0000')
        .setColorText('#ffffff')
        .setPositionConfig(ToastPositionConfig.Create(100, 100, 100, 100))
        .setAnimationConfig(ToastAnimationConfig.Create(1000, 500));

      // Verify all settings are maintained
      expect(config.colorBgError).toBe('#ff0000');
      expect(config.colorText).toBe('#ffffff');
      expect(config.positionConfig.topPx).toBe(100);
      expect(config.animationConfig.leaveMs).toBe(1000);
      
      // Original defaults should still be intact for unchanged values
      expect(config.colorBgWarn).toBe(ToastSetupConstants.ColorBgWarn);
      expect(config.colorBgSuccess).toBe(ToastSetupConstants.ColorBgSuccess);
    });

    it('should handle complex configuration scenarios', () => {
      const customPosition = ToastPositionConfig.Create(50, 75, 100, 125);
      const customAnimation = ToastAnimationConfig.Create(2000, 1000);
      
      const config = ToastConfig.Create(
        '#error-red',
        '#warn-yellow', 
        '#success-green',
        '#info-blue',
        '#default-white',
        '#text-black',
        customPosition,
        customAnimation
      );

      // Verify all custom values are set correctly
      expect(config.colorBgError).toBe('#error-red');
      expect(config.colorBgWarn).toBe('#warn-yellow');
      expect(config.colorBgSuccess).toBe('#success-green');
      expect(config.colorBgInfo).toBe('#info-blue');
      expect(config.colorBgDefault).toBe('#default-white');
      expect(config.colorText).toBe('#text-black');
      expect(config.positionConfig).toBe(customPosition);
      expect(config.animationConfig).toBe(customAnimation);
      
      // Further modifications should work
      config.setColorBgError('#new-error-color');
      expect(config.colorBgError).toBe('#new-error-color');
      
      // Other values should remain unchanged
      expect(config.colorBgWarn).toBe('#warn-yellow');
      expect(config.positionConfig.topPx).toBe(50);
    });
  });
});
