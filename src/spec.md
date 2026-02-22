# Specification

## Summary
**Goal:** Fix the customer creation persistence bug preventing new customers from being saved to the backend.

**Planned changes:**
- Debug and fix the backend createCustomer function in backend/main.mo to resolve persistence failure
- Verify frontend CustomerForm component correctly serializes and sends all customer data (name, phone, email, address) to the backend
- Ensure useCreateCustomer React Query mutation hook properly handles backend response and updates customer list cache after successful creation

**User-visible outcome:** Users can successfully create new customers through the form, and newly created customers immediately appear in the customer list without errors.
