import ExplicitStore from '../src/store';
import main from '../src';
import { Store } from '../src';

describe('Main', () => {

    it('should expose Store in it\'s default export', () => {
        expect(main.Store).toEqual(ExplicitStore);
    });

    it('should expose Store as a named export', () => {
        expect(Store).toEqual(ExplicitStore);
    });

});
