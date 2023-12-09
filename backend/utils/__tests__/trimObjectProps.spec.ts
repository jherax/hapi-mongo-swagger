import trimObjectProps from '../trimObjectProps';

describe('Testing trimObjectProps()', () => {
  it('should trim all string properties in an object', () => {
    const inputObj = {
      id: ' 65735fa9a378824bf2347bf5 ',
      name: '  Pablo Picasso   ',
      year: 1937,
      children: 1,
      spouse: true,
    };
    expect(trimObjectProps(inputObj)).toStrictEqual({
      id: '65735fa9a378824bf2347bf5',
      name: 'Pablo Picasso',
      year: 1937,
      children: 1,
      spouse: true,
    });
  });

  it('should throw eroor if the input is not an object', () => {
    expect(() => {
      trimObjectProps(() => true);
    }).toThrow('Input value is not an object');
  });
});
