import { render, screen, act } from '@testing-library/react';
import Toastr from './Toastr';

test('renders toastr with message', () => {
    render(<Toastr message="Test message" />);
    expect(screen.getByText(/Test message/i)).toBeInTheDocument();
});

test('hides toastr after duration', () => {
    jest.useFakeTimers();
    render(<Toastr message="Test message" duration={1000} />);
    expect(screen.getByText(/Test message/i)).toBeInTheDocument();
    act(() => {
        jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/Test message/i)).not.toBeInTheDocument();
});