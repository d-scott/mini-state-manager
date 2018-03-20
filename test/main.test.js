import ExplicitStore from '../src/store';
import { Store } from '../src';

describe('Main', () => {

    it('should expose Store as a named export', () => {
        expect(Store).toEqual(ExplicitStore);
    });

});
