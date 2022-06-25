import { compile, ajv } from '../ajv'

describe('utils > ajv > compile', () => {
  it(`Takes an object in which the values are JSON schema definitions and 
  returns a new object where the values are the compiled schema returned by 
  ajv`, () => {
    const schemas = compile({
      foo: {
        name: 'Foo',
        type: 'object',
        properties: {
          str: { type: 'string' },
        },
      },
      bar: {
        name: 'Bar',
        type: 'object',
        properties: {
          str: { type: 'string' },
          int: { type: 'integer' },
        },
        required: ['str', 'int'],
      },
    })
    expect(schemas.foo.schema.name).toEqual('Foo')
  })
})
