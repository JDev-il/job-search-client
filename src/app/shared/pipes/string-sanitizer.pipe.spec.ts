import { StringSanitizerPipe } from './string-sanitizer.pipe';

describe('StringSanitizerPipe', () => {
  it('create an instance', () => {
    const pipe = new StringSanitizerPipe();
    expect(pipe).toBeTruthy();
  });
});
