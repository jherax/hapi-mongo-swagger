import paintingsMock from '../../__mocks__/paintings.json';
import filterProps from '../filterProps';

describe('Testing filterProps()', () => {
  // Should return an object with only the specified properties from the input object
  it('should return an object with only the specified properties', () => {
    const input: Partial<IPainting> = {
      _id: '123',
      name: 'Painting 1',
      author: 'Author 1',
      year: '2020',
      url: 'http://example.com/painting1',
    };
    const keys = ['_id', 'name', 'author'];
    const expected = {
      _id: '123',
      name: 'Painting 1',
      author: 'Author 1',
    };

    const result = filterProps<typeof input>(keys)(input);
    expect(result).toEqual(expected);
  });

  it('should be used to map an array of objects with only the specified properties', () => {
    const paintings = paintingsMock as IPainting[];
    const keys = ['name', 'author'];
    const expected = [
      {
        name: 'Mona Lisa',
        author: 'Leonardo Da Vinci',
      },
      {
        name: 'The Starry Night',
        author: 'Vincent van Gogh',
      },
      {
        name: 'The Garden of Earthly Delights',
        author: 'Hieronymus Bosch',
      },
      {
        name: 'The Birth of Venus',
        author: 'Sandro Botticelli',
      },
    ];

    const result = paintings.map(filterProps(keys));
    expect(result).toEqual(expected);
  });

  it('should throw an error when the input object is null', () => {
    const keys = ['name', 'author'];
    const input = null;

    expect(() => filterProps(keys)(input)).toThrow(
      /Cannot read properties of null/,
    );
  });

  it('should return an empty object when the input object is not an object', () => {
    const input = 'not an object';
    const keys = ['name', 'author', 'url'];
    const expected = {};

    const result = filterProps(keys)(input);
    expect(result).toEqual(expected);
  });
});
