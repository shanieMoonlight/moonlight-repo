import { ColorUtilsService } from './color-utils.service';

describe('ColorUtilsService', () => {
    let service: ColorUtilsService;

    //-----------------------------//

    beforeEach(() => {
        service = new ColorUtilsService();
    });

    //-----------------------------//

    describe('extractRGB', () => {
        it('should extract RGB values from a standard hex color', () => {
            expect(service.extractRGB('#FF5733')).toEqual([255, 87, 51]);
            expect(service.extractRGB('#123456')).toEqual([18, 52, 86]);
        });

        //- - - - - - - - - - - - - - -//

        it('should extract RGB values from hex color without hash', () => {
            expect(service.extractRGB('FF5733')).toEqual([255, 87, 51]);
            expect(service.extractRGB('123456')).toEqual([18, 52, 86]);
        });

        //- - - - - - - - - - - - - - -//

        it('should handle shorthand hex colors', () => {
            expect(service.extractRGB('#F00')).toEqual([255, 0, 0]);
            expect(service.extractRGB('#0F0')).toEqual([0, 255, 0]);
            expect(service.extractRGB('#00F')).toEqual([0, 0, 255]);
            expect(service.extractRGB('ABC')).toEqual([170, 187, 204]);
        });
    });

    //-----------------------------//

    describe('getRGBString', () => {
        it('should return comma-separated RGB values', () => {
            expect(service.getRGBString('#FF5733')).toBe('255, 87, 51');
            expect(service.getRGBString('#000000')).toBe('0, 0, 0');
            expect(service.getRGBString('#FFFFFF')).toBe('255, 255, 255');
        });

        //- - - - - - - - - - - - - - -//

        it('should handle shorthand hex colors', () => {
            expect(service.getRGBString('#F00')).toBe('255, 0, 0');
            expect(service.getRGBString('#0F0')).toBe('0, 255, 0');
        });
    });

    //-----------------------------//

    describe('getRGBA', () => {
        it('should return rgba string with specified alpha', () => {
            expect(service.getRGBA('#FF5733', 0.5)).toBe('rgba(255, 87, 51, 0.5)');
            expect(service.getRGBA('#000', 0.25)).toBe('rgba(0, 0, 0, 0.25)');
            expect(service.getRGBA('#FFF', 1)).toBe('rgba(255, 255, 255, 1)');
        });
    });

    //-----------------------------//

    describe('setRGBVariable', () => {
        it('should set a CSS variable with RGB values', () => {
            // Mock element
            const mockElement = {
                style: {
                    setProperty: jest.fn()
                }
            } as unknown as HTMLElement;

            // Call the method
            service.setRGBVariable(mockElement, '--test-color-rgb', '#FF5733');

            // Verify the mock was called correctly
            expect(mockElement.style.setProperty).toHaveBeenCalledWith(
                '--test-color-rgb',
                '255, 87, 51'
            );
        });

        //- - - - - - - - - - - - - - -//

        it('should handle shorthand hex colors when setting CSS variable', () => {
            // Mock element
            const mockElement = {
                style: {
                    setProperty: jest.fn()
                }
            } as unknown as HTMLElement;

            // Call the method
            service.setRGBVariable(mockElement, '--test-color-rgb', '#F00');

            // Verify the mock was called correctly
            expect(mockElement.style.setProperty).toHaveBeenCalledWith(
                '--test-color-rgb',
                '255, 0, 0'
            );
        });
    });
});